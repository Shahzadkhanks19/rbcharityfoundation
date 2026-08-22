import { lazy, Suspense } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import SiteLayout from '../components/SiteLayout'
import PublicMetadata from '../components/PublicMetadata'
import { PageSkeleton } from '../components/system/SystemUI'

const lazyNamed = (loader, name) => lazy(() => loader().then(module => ({ default: module[name] })))

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

const AdminGuard = lazyNamed(() => import('../pages/AdminPages'), 'AdminGuard')
const AdminLoginPage = lazyNamed(() => import('../pages/AdminPages'), 'AdminLoginPage')
const AdminForgotPasswordPage = lazyNamed(() => import('../pages/AdminPages'), 'AdminForgotPasswordPage')
const AdminResetPasswordPage = lazyNamed(() => import('../pages/AdminPages'), 'AdminResetPasswordPage')
const AdminDashboardPage = lazyNamed(() => import('../pages/AdminPages'), 'AdminDashboardPage')
const AdminSettingsPage = lazyNamed(() => import('../pages/AdminSystemPages'), 'AdminSettingsPage')
const AdminActivityPage = lazyNamed(() => import('../pages/AdminSystemPages'), 'AdminActivityPage')
const TransparencyPage = lazyNamed(() => import('../pages/ContentPages'), 'TransparencyPage')
const DynamicReportsPage = lazyNamed(() => import('../pages/DynamicPublicPages'), 'DynamicReportsPage')
const DynamicGalleryPage = lazyNamed(() => import('../pages/DynamicPublicPages'), 'DynamicGalleryPage')
const DynamicStoriesPage = lazyNamed(() => import('../pages/DynamicStoryPages'), 'DynamicStoriesPage')
const DynamicStoryDetailsPage = lazyNamed(() => import('../pages/DynamicStoryPages'), 'DynamicStoryDetailsPage')
const AboutPage = lazyNamed(() => import('../pages/PublicInfoPages'), 'AboutPage')
const DonationSuccessPage = lazyNamed(() => import('../pages/PublicInfoPages'), 'DonationSuccessPage')
const FAQPage = lazyNamed(() => import('../pages/PublicInfoPages'), 'FAQPage')
const LegalPage = lazyNamed(() => import('../pages/PublicInfoPages'), 'LegalPage')
const ErrorPage = lazyNamed(() => import('../pages/SystemPages'), 'ErrorPage')
const NotFoundPage = lazyNamed(() => import('../pages/SystemPages'), 'NotFoundPage')

function LoadingRoute() {
  return <PageSkeleton cards={4} />
}

function Suspended({ children }) {
  return <Suspense fallback={<LoadingRoute />}>{children}</Suspense>
}

function PublicRoute({ children }) {
  return <SiteLayout><Suspended>{children}</Suspended></SiteLayout>
}

const cmsResources = ['campaigns', 'causes', 'stories', 'gallery']
const detailedDataResources = ['donations', 'donors']
const engagementResources = ['volunteers', 'partners', 'messages']

export default function PlatformRouter() {
  return (
    <BrowserRouter>
      <PublicMetadata />
      <Routes>
        <Route path="/" element={<Suspended><HomePage /></Suspended>} />
        <Route path="/about" element={<PublicRoute><AboutPage /></PublicRoute>} />
        <Route path="/causes" element={<PublicRoute><CausesPage /></PublicRoute>} />
        <Route path="/causes/:slug" element={<PublicRoute><CauseDetailsPage /></PublicRoute>} />
        <Route path="/campaigns" element={<PublicRoute><CampaignsPage /></PublicRoute>} />
        <Route path="/campaigns/:slug" element={<PublicRoute><CampaignDetailsPage /></PublicRoute>} />
        <Route path="/donate" element={<PublicRoute><DonatePage /></PublicRoute>} />
        <Route path="/donate/success" element={<PublicRoute><DonationSuccessPage /></PublicRoute>} />
        <Route path="/volunteer" element={<PublicRoute><EngagementFormPage type="volunteer" /></PublicRoute>} />
        <Route path="/partner" element={<PublicRoute><EngagementFormPage type="partner" /></PublicRoute>} />
        <Route path="/contact" element={<PublicRoute><EngagementFormPage type="contact" /></PublicRoute>} />
        <Route path="/impact" element={<PublicRoute><CmsImpactPage /></PublicRoute>} />
        <Route path="/transparency" element={<PublicRoute><TransparencyPage /></PublicRoute>} />
        <Route path="/reports" element={<PublicRoute><DynamicReportsPage /></PublicRoute>} />
        <Route path="/stories" element={<PublicRoute><DynamicStoriesPage /></PublicRoute>} />
        <Route path="/stories/:slug" element={<PublicRoute><DynamicStoryDetailsPage /></PublicRoute>} />
        <Route path="/gallery" element={<PublicRoute><DynamicGalleryPage /></PublicRoute>} />
        <Route path="/faq" element={<PublicRoute><FAQPage /></PublicRoute>} />
        <Route path="/privacy" element={<PublicRoute><LegalPage type="privacy" /></PublicRoute>} />
        <Route path="/terms" element={<PublicRoute><LegalPage type="terms" /></PublicRoute>} />
        <Route path="/refund-policy" element={<PublicRoute><LegalPage type="refund" /></PublicRoute>} />
        <Route path="/error" element={<PublicRoute><ErrorPage /></PublicRoute>} />

        <Route path="/admin/login" element={<Suspended><AdminLoginPage /></Suspended>} />
        <Route path="/admin/forgot-password" element={<Suspended><AdminForgotPasswordPage /></Suspended>} />
        <Route path="/admin/reset-password" element={<Suspended><AdminResetPasswordPage /></Suspended>} />
        <Route element={<Suspended><AdminGuard /></Suspended>}>
          <Route path="/admin/dashboard" element={<Suspended><AdminDashboardPage /></Suspended>} />
          {cmsResources.map(resource => <Route key={resource} path={`/admin/${resource}`} element={<Suspended><AdminCmsPage resource={resource} /></Suspended>} />)}
          {detailedDataResources.map(resource => <Route key={resource} path={`/admin/${resource}`} element={<Suspended><AdminDataPage resource={resource} /></Suspended>} />)}
          {engagementResources.map(resource => <Route key={resource} path={`/admin/${resource}`} element={<Suspended><AdminEngagementPage resource={resource} /></Suspended>} />)}
          <Route path="/admin/reports" element={<Suspended><AdminReportsPage /></Suspended>} />
          <Route path="/admin/settings" element={<Suspended><AdminSettingsPage /></Suspended>} />
          <Route path="/admin/activity" element={<Suspended><AdminActivityPage /></Suspended>} />
        </Route>

        <Route path="/404" element={<PublicRoute><NotFoundPage /></PublicRoute>} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
