import express from 'express'
import jwt from 'jsonwebtoken'
import ActivityLog from '../models/ActivityLog.js'
import Campaign from '../models/Campaign.js'
import Cause from '../models/Cause.js'
import ContactMessage from '../models/ContactMessage.js'
import Donation from '../models/Donation.js'
import Donor from '../models/Donor.js'
import FoundationSetting from '../models/FoundationSetting.js'
import GalleryItem from '../models/GalleryItem.js'
import Partner from '../models/Partner.js'
import Report from '../models/Report.js'
import SiteContent from '../models/SiteContent.js'
import Story from '../models/Story.js'
import Volunteer from '../models/Volunteer.js'
import { requireAdmin } from '../middleware/adminAuth.js'

const router = express.Router()
const models={causes:Cause,campaigns:Campaign,donations:Donation,donors:Donor,volunteers:Volunteer,partners:Partner,stories:Story,messages:ContactMessage,gallery:GalleryItem,reports:Report,content:SiteContent,settings:FoundationSetting,activity:ActivityLog}
const creatable=['causes','campaigns','stories','gallery','reports','content','settings']
const allowedStatuses={donations:['pending','paid','failed'],donors:['active','blocked','deleted'],volunteers:['new','reviewing','approved','assigned','inactive'],partners:['new','contacted','proposal','active','closed'],messages:['new','read','replied','archived'],causes:['draft','published','archived'],campaigns:['draft','active','completed','paused','archived'],stories:['draft','published','archived'],gallery:['draft','published','archived'],reports:['draft','published','archived']}
const log=async(req,action,resource,id='',details='')=>{try{await ActivityLog.create({actor:req.admin?.email||'admin',action,resource,resourceId:String(id||''),details})}catch{}}

router.post('/login',(req,res)=>{
  const email=String(req.body.email||'').trim().toLowerCase(),password=String(req.body.password||'')
  if(!process.env.ADMIN_EMAIL||!process.env.ADMIN_PASSWORD)return res.status(503).json({success:false,message:'Admin credentials are not configured on the server.'})
  if(email!==process.env.ADMIN_EMAIL.trim().toLowerCase()||password!==process.env.ADMIN_PASSWORD)return res.status(401).json({success:false,message:'Incorrect admin email or password.'})
  const secret=process.env.JWT_SECRET
  if(!secret)return res.status(503).json({success:false,message:'JWT_SECRET is not configured on the server.'})
  const token=jwt.sign({role:'admin',email},secret,{expiresIn:'8h'})
  res.json({success:true,token,admin:{email}})
})

router.use(requireAdmin)
router.get('/me',(req,res)=>res.json({success:true,admin:{email:req.admin.email}}))
router.get('/dashboard',async(_req,res)=>{
  const [donations,donors,volunteers,partners,messages,campaigns,causes,stories]=await Promise.all([Donation.find().sort({createdAt:-1}).lean(),Donor.countDocuments(),Volunteer.countDocuments(),Partner.countDocuments(),ContactMessage.countDocuments(),Campaign.countDocuments(),Cause.countDocuments(),Story.countDocuments()])
  const paid=donations.filter(x=>x.status==='paid')
  res.json({success:true,summary:{totalRaised:paid.reduce((s,x)=>s+x.amount,0),donations:donations.length,donors,volunteers,partners,messages,campaigns,causes,stories},recentDonations:donations.slice(0,6)})
})
router.get('/:resource',async(req,res)=>{
  const Model=models[req.params.resource];if(!Model)return res.status(404).json({success:false,message:'Unknown admin resource.'})
  const items=await Model.find().sort({createdAt:-1}).limit(300).lean();res.json({success:true,items})
})
router.post('/:resource',async(req,res)=>{
  const Model=models[req.params.resource];if(!Model||!creatable.includes(req.params.resource))return res.status(405).json({success:false,message:'Creation is not supported for this resource.'})
  const item=await Model.create(req.body);await log(req,'create',req.params.resource,item._id);res.status(201).json({success:true,item})
})
router.patch('/:resource/:id',async(req,res)=>{
  const Model=models[req.params.resource];if(!Model)return res.status(404).json({success:false,message:'Unknown admin resource.'})
  const body={...req.body};if(body.status&&allowedStatuses[req.params.resource]&&!allowedStatuses[req.params.resource].includes(body.status))return res.status(400).json({success:false,message:'Invalid status.'});if(req.params.resource==='donors')delete body.passwordHash
  const item=await Model.findByIdAndUpdate(req.params.id,body,{new:true,runValidators:true});if(!item)return res.status(404).json({success:false,message:'Record not found.'});await log(req,'update',req.params.resource,item._id);res.json({success:true,item})
})
router.delete('/:resource/:id',async(req,res)=>{
  if(req.params.resource==='activity')return res.status(405).json({success:false,message:'Activity logs cannot be deleted from the admin UI.'})
  const Model=models[req.params.resource];if(!Model)return res.status(404).json({success:false,message:'Unknown admin resource.'});const item=await Model.findByIdAndDelete(req.params.id);if(!item)return res.status(404).json({success:false,message:'Record not found.'});await log(req,'delete',req.params.resource,req.params.id);res.json({success:true})
})

export default router
