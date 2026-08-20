import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import HomePage from '../App'
import SiteLayout from '../components/SiteLayout'
import { AdminDashboardPage, AdminLoginPage, AdminModulePage, AdminResourcePage } from '../pages/AdminPages'
import CampaignDetailsPage from '../pages/CampaignDetailsPage'
import CampaignsPage from '../pages/CampaignsPage'
import CauseDetailsPage from '../pages/CauseDetailsPage'
import CausesPage from '../pages/CausesPage'
import { GalleryPage, ImpactPage, ReportsPage, StoriesPage, StoryDetailsPage, TransparencyPage } from '../pages/ContentPages'
import DonatePage from '../pages/DonatePage'
import { DonorAuthPage, DonorCampaignsPage, DonorDashboardPage, DonorDonationsPage, DonorProfilePage, DonorReceiptsPage } from '../pages/DonorPages'
import EngagementFormPage from '../pages/EngagementFormPage'
import ModulePage from '../pages/ModulePage'
import { AboutPage, DonationSuccessPage, FAQPage, LegalPage } from '../pages/PublicInfoPages'

const withPublicLayout = element => <SiteLayout>{element}</SiteLayout>

export default function PlatformRouter() {
  return <BrowserRouter><Routes>
    <Route path="/" element={<HomePage/>}/>
    <Route path="/about" element={withPublicLayout(<AboutPage/>)}/>
    <Route path="/causes" element={withPublicLayout(<CausesPage/>)}/>
    <Route path="/causes/:slug" element={withPublicLayout(<CauseDetailsPage/>)}/>
    <Route path="/campaigns" element={withPublicLayout(<CampaignsPage/>)}/>
    <Route path="/campaigns/:slug" element={withPublicLayout(<CampaignDetailsPage/>)}/>
    <Route path="/donate" element={withPublicLayout(<DonatePage/>)}/>
    <Route path="/donate/success" element={withPublicLayout(<DonationSuccessPage/>)}/>
    <Route path="/volunteer" element={withPublicLayout(<EngagementFormPage type="volunteer"/>)}/>
    <Route path="/partner" element={withPublicLayout(<EngagementFormPage type="partner"/>)}/>
    <Route path="/contact" element={withPublicLayout(<EngagementFormPage type="contact"/>)}/>
    <Route path="/impact" element={withPublicLayout(<ImpactPage/>)}/>
    <Route path="/transparency" element={withPublicLayout(<TransparencyPage/>)}/>
    <Route path="/reports" element={withPublicLayout(<ReportsPage/>)}/>
    <Route path="/stories" element={withPublicLayout(<StoriesPage/>)}/>
    <Route path="/stories/:slug" element={withPublicLayout(<StoryDetailsPage/>)}/>
    <Route path="/gallery" element={withPublicLayout(<GalleryPage/>)}/>
    <Route path="/faq" element={withPublicLayout(<FAQPage/>)}/>
    <Route path="/privacy" element={withPublicLayout(<LegalPage type="privacy"/>)}/>
    <Route path="/terms" element={withPublicLayout(<LegalPage type="terms"/>)}/>
    <Route path="/refund-policy" element={withPublicLayout(<LegalPage type="refund"/>)}/>

    <Route path="/donor/login" element={<DonorAuthPage mode="login"/>}/>
    <Route path="/donor/register" element={<DonorAuthPage mode="register"/>}/>
    <Route path="/donor/dashboard" element={<DonorDashboardPage/>}/>
    <Route path="/donor/donations" element={<DonorDonationsPage/>}/>
    <Route path="/donor/receipts" element={<DonorReceiptsPage/>}/>
    <Route path="/donor/campaigns" element={<DonorCampaignsPage/>}/>
    <Route path="/donor/profile" element={<DonorProfilePage/>}/>

    <Route path="/admin/login" element={<AdminLoginPage/>}/>
    <Route path="/admin/dashboard" element={<AdminDashboardPage/>}/>
    <Route path="/admin/campaigns" element={<AdminResourcePage resource="campaigns"/>}/>
    <Route path="/admin/causes" element={<AdminResourcePage resource="causes"/>}/>
    <Route path="/admin/donations" element={<AdminResourcePage resource="donations"/>}/>
    <Route path="/admin/donors" element={<AdminResourcePage resource="donors"/>}/>
    <Route path="/admin/volunteers" element={<AdminResourcePage resource="volunteers"/>}/>
    <Route path="/admin/partners" element={<AdminResourcePage resource="partners"/>}/>
    <Route path="/admin/stories" element={<AdminResourcePage resource="stories"/>}/>
    <Route path="/admin/messages" element={<AdminResourcePage resource="messages"/>}/>
    <Route path="/admin/gallery" element={<AdminModulePage title="Gallery Management" description="Manage foundation media, albums and campaign-linked gallery content."/>}/>
    <Route path="/admin/reports" element={<AdminModulePage title="Reports & Transparency" description="Manage public reports, downloadable documents and transparency records."/>}/>
    <Route path="/admin/content" element={<AdminModulePage title="Website Content" description="Manage homepage, about, impact, FAQ, footer and SEO content."/>}/>
    <Route path="/admin/settings" element={<AdminModulePage title="Foundation Settings" description="Manage foundation identity, contacts, payment, receipt and social settings."/>}/>
    <Route path="/admin/activity" element={<AdminModulePage title="Activity Log" description="Review important administrative and security actions."/>}/>

    <Route path="/404" element={withPublicLayout(<ModulePage title="Page Not Found" description="The page you requested could not be found." modules={['Return home','Browse causes','View campaigns','Contact support']}/>)}/>
    <Route path="*" element={<Navigate to="/404" replace/>}/>
  </Routes></BrowserRouter>
}
