import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import BlogTopicRssDirectory from "@/components/BlogTopicRssDirectory";
import BlogTopicAlertPreferences from "@/components/BlogTopicAlertPreferences";
import TopicRssSubscribeLink from "@/components/TopicRssSubscribeLink";
import PublicSiteHeader from "@/components/PublicSiteHeader";
import NotFound from "@/pages/NotFound";
import { Route, Switch, useLocation } from "wouter";
import { useEffect, useState } from "react";
import ErrorBoundary from "./components/ErrorBoundary";
import GlobalCommandSearch from "./components/GlobalCommandSearch";
import MobileNavigationDrawer from "./components/MobileNavigationDrawer";
import { LogoVideoAudioProvider } from "./contexts/LogoVideoAudioContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import { VisualPreferencesProvider } from "./contexts/VisualPreferencesContext";
import Blog from "./pages/Blog";
import { BlogAuthorDetail, BlogTopicDetail } from "./pages/BlogDiscoveryDetail";
import BlogPostDetail from "./pages/BlogPostDetail";
import BookingConfirmation from "./pages/BookingConfirmation";
import BookingMetrics from "./pages/BookingMetrics";
import AutomationBuilder from "./pages/AutomationBuilder";
import DraftPreview from "./pages/DraftPreview";
import ContentAdmin from "./pages/ContentAdmin";
import ClientResources from "./pages/ClientResources";
import ConsultingRedirect from "./pages/ConsultingRedirect";
import DeliveryGuide from "./pages/DeliveryGuide";
import Home from "./pages/Home";
import UseCases from "./pages/UseCases";
import LegacyKnowledge from "./pages/LegacyKnowledge";
import PostCallResources from "./pages/PostCallResources";
import TalkToExpert from "./pages/TalkToExpert";
import VisitorAnalytics from "./pages/VisitorAnalytics";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import UseCaseDetail from "./pages/UseCaseDetail";
import { applyManagedContentDocuments, type ManagedContentDocument } from "./lib/managedSiteContent";
import { trpc } from "./lib/trpc";

function Router() {
  return <Switch><Route path="/" component={Home} /><Route path="/use-cases" component={UseCases} /><Route path="/use-case/:id" component={UseCaseDetail} /><Route path="/delivery-guide" component={DeliveryGuide} /><Route path="/consulting" component={ConsultingRedirect} /><Route path="/expert" component={TalkToExpert} /><Route path="/booking-confirmed" component={BookingConfirmation} /><Route path="/post-call-resources" component={PostCallResources} /><Route path="/client-resources" component={ClientResources} /><Route path="/owner/booking-metrics" component={BookingMetrics} /><Route path="/owner/visitor-analytics" component={VisitorAnalytics} /><Route path="/privacy-policy" component={PrivacyPolicy} /><Route path="/owner/content" component={ContentAdmin} /><Route path="/owner/automations" component={AutomationBuilder} /><Route path="/draft-preview/:token" component={DraftPreview} /><Route path="/knowledge" component={LegacyKnowledge} /><Route path="/blog/authors/:slug" component={BlogAuthorDetail} /><Route path="/blog/topics/:slug" component={BlogTopicDetail} /><Route path="/blog" component={Blog} /><Route path="/blog/:slug" component={BlogPostDetail} /><Route path="/404" component={NotFound} /><Route component={NotFound} /></Switch>;
}

function PublicNavigationShell() {
  const [location] = useLocation();
  const [, setContentRevision] = useState(0);
  const publishedContent = trpc.siteContent.publicDocuments.useQuery(undefined, { refetchOnWindowFocus: false });
  const pageView = trpc.siteAnalytics.recordPageView.useMutation();
  useEffect(() => {
    if (publishedContent.data?.length && applyManagedContentDocuments(publishedContent.data as ManagedContentDocument[])) setContentRevision((revision) => revision + 1);
  }, [publishedContent.data]);
  useEffect(() => {
    if (location.startsWith("/owner/") || location.startsWith("/draft-preview/")) return;
    pageView.mutate({ path: location });
  }, [location]);
  const hasSharedNavigation = !location.startsWith("/owner/");
  const topicMatch = location.match(/^\/blog\/topics\/([^/]+)$/);
  return <>{hasSharedNavigation && <PublicSiteHeader currentPath={location} />}<div className={hasSharedNavigation ? "public-route-container" : ""}><Router />{location === "/blog" && <><BlogTopicAlertPreferences /><BlogTopicRssDirectory /></>}{topicMatch && <TopicRssSubscribeLink slug={topicMatch[1]} />}</div>{hasSharedNavigation && <><GlobalCommandSearch /><MobileNavigationDrawer /></>}</>;
}

function App() {
  return <ErrorBoundary><ThemeProvider defaultTheme="dark" switchable><VisualPreferencesProvider><LogoVideoAudioProvider><TooltipProvider><Toaster /><PublicNavigationShell /></TooltipProvider></LogoVideoAudioProvider></VisualPreferencesProvider></ThemeProvider></ErrorBoundary>;
}

export default App;
