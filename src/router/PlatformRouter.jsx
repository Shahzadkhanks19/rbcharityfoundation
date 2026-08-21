import { lazy, Suspense } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import SiteLayout from '../components/SiteLayout'
import { PageSkeleton } from '../components/system/SystemUI'

const HomePage = lazy(() => import('../App'))
const AdminCmsPage = lazy(() => import('../pages/AdminCmsPages'))
const AdminDataPage = lazy(() => import('../pages/AdminDataPages'))
const AdminEngagementPage = lazy(() => import('../pages/AdminEngagementPage'))
const AdminReportsPage = lazy(() => import('../pages/AdminReportsPage'))
const CampaignDetailsPage = lazy(() => import('../pages/CampaignDetailsPage'))
const CampaignsPage = lazy(() => import('../pages/CampaignsPage'))
const CauseDetailsPage = lazy(() => import('../pages/CauseDetailsPage'))
const CausesPage = lazy(() => import('../pages/CausesPage'))
const CmsImpactPage = lazy(() => import('../pages/CmsImpactPage'))
const DonatePage = lazy(() => import('../pages/DonatePage'))
const EngagementFormPage = lazy(() => import('../pages/EngagementFormPage'))

const AdminPages = lazy(() => import('../pages/AdminPages'))
const AdminSystemPages = lazy(() => import('../pages/AdminSystemPages'))
const ContentPages = lazy(() => import('../pages/ContentPages'))
const DynamicPublicPages = lazy(() => import('../pages/DynamicPublicPages'))
const DynamicStoryPages = lazy(() => import('../pages/DynamicStoryPages'))
const PublicInfoPages = lazy(() => import('../pages/PublicInfoPages'))
const SystemPages = lazy(() => import('../pages/SystemPages'))

function LoadingRoute() {
  return <PageSkeleton cards={4} />
}

function PublicRoute({ children }) {
  return <SiteLayout><Suspense fallback={<LoadingRoute />}>{children}</Suspense></SiteLayout>
}

const cmsResources = ['campaigns', 'causes', 'stories', 'gallery']
const detailedDataResources = ['donations', 'donors']
const engagementResources = ['volunteers', 'partners', 'messages']

function AdminLoginRoute() {
  return <Suspense fallback={<LoadingRoute />}><AdminPages.AdminLoginPage /></Suspense>
}
function AdminForgotRoute() {
  return <Suspense fallback={<LoadingRoute />}><AdminPages.AdminForgotPasswordPage /></Suspense>
}
function AdminResetRoute() {
  return <Suspense fallback={<LoadingRoute />}><AdminPages.AdminResetPasswordPage /></Suspense>
}
function AdminGuardRoute() {
  return <Suspense fallback={<LoadingRoute />}><AdminPages.AdminGuard /></Suspense>
}
function AdminDashboardRoute() {
  return <Suspense fallback={<LoadingRoute />}><AdminPages.AdminDashboardPage /></Suspense>
}
function AdminSettingsRoute() {
  return <Suspense fallback={<LoadingRoute />}><AdminSystemPages.AdminSettingsPage /></Suspense>
}
function AdminActivityRoute() {
  return <Suspense fallback={<LoadingRoute />}><AdminSystemPages.AdminActivityPage /></Suspense>
}

export default function PlatformRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Suspense fallback={<LoadingRoute />}><HomePage /></Suspense>} />
        <Route path="/about" element={<PublicRoute><PublicInfoPages.AboutPage /></PublicRoute>} />
        <Route path="/causes" element={<PublicRoute><CausesPage /></PublicRoute>} />
        <Route path="/causes/:slug" element={<PublicRoute><CauseDetailsPage /></PublicRoute>} />
        <Route path="/campaigns" element={<PublicRoute><CampaignsPage /></PublicRoute>} />
        <Route path="/campaigns/:slug" element={<PublicRoute><CampaignDetailsPage /></PublicRoute>} />
        <Route path="/donate" element={<PublicRoute><DonatePage /></PublicRoute>} />
        <Route path="/donate/success" element={<PublicRoute><PublicInfoPages.DonationSuccessPage /></PublicRoute>} />
        <Route path="/volunteer" element={<PublicRoute><EngagementFormPage type="volunteer" /></PublicRoute>} />
        <Route path="/partner" element={<PublicRoute><EngagementFormPage type="partner" /></PublicRoute>} />
        <Route path="/contact" element={<PublicRoute><EngagementFormPage type="contact" /></PublicRoute>} />
        <Route path="/impact" element={<PublicRoute><CmsImpactPage /></PublicRoute>} />
        <Route path="/transparency" element={<PublicRoute><ContentPages.TransparencyPage /></PublicRoute>} />
        <Route path="/reports" element={<PublicRoute><DynamicPublicPages.DynamicReportsPage /></PublicRoute>} />
        <Route path="/stories" element={<PublicRoute><DynamicStoryPages.DynamicStoriesPage /></PublicRoute>} />
        <Route path="/stories/:slug" element={<PublicRoute><DynamicStoryPages.DynamicStoryDetailsPage /></PublicRoute>} />
        <Route path="/gallery" element={<PublicRoute><DynamicPublicPages.DynamicGalleryPage /></PublicRoute>} />
        <Route path="/faq" element={<PublicRoute><PublicInfoPages.FAQPage /></PublicRoute>} />
        <Route path="/privacy" element={<PublicRoute><PublicInfoPages.LegalPage type="privacy" /></PublicRoute>} />
        <Route path="/terms" element={<PublicRoute><PublicInfoPages.LegalPage type="terms" /></PublicRoute>} />
        <Route path="/refund-policy" element={<PublicRoute><PublicInfoPages.LegalPage type="refund" /></PublicRoute>} />
        <Route path="/error" element={<PublicRoute><SystemPages.ErrorPage /></PublicRoute>} />

        <Route path="/admin/login" element={<AdminLoginRoute />} />
        <Route path="/admin/forgot-password" element={<AdminForgotRoute />} />
        <Route path="/admin/reset-password" element={<AdminResetRoute />} />
        <Route element={<AdminGuardRoute />}>
          <Route path="/admin/dashboard" element={<AdminDashboardRoute />} />
          {cmsResources.map(resource => <Route key={resource} path={`/admin/${resource}`} element={<Suspense fallback={<LoadingRoute />}><AdminCmsPage resource={resource} /></Suspense>} />)}
          {detailedDataResources.map(resource => <Route key={resource} path={`/admin/${resource}`} element={<Suspense fallback={<LoadingRoute />}><AdminDataPage resource={resource} /></Suspense>} />)}
          {engagementResources.map(resource => <Route key={resource} path={`/admin/${resource}`} element={<Suspense fallback={<LoadingRoute />}><AdminEngagementPage resource={resource} /></Suspense>} />)}
          <Route path="/admin/reports" element={<Suspense fallback={<LoadingRoute />}><AdminReportsPage /></Suspense>} />
          <Route path="/admin/settings" element={<AdminSettingsRoute />} />
          <Route path="/admin/activity" element={<AdminActivityRoute />} />
        </Route>

        <Route path="/404" element={<PublicRoute><SystemPages.NotFoundPage /></PublicRoute>} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
