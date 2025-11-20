import { Outlet, RouterProvider, createBrowserRouter } from "react-router-dom";
import { lazy, Suspense } from "react";
import "./App.css";
import { Navbar } from "./components";

// Lazy load all page components
const LandingPage = lazy(() => import("./modules/LandingPage").then(m => ({ default: m.LandingPage })));
const HomePage = lazy(() => import("./modules/HomePage").then(m => ({ default: m.HomePage })));
const LoginPage = lazy(() => import("./modules/LoginPage").then(m => ({ default: m.LoginPage })));
const RegisterPage = lazy(() => import("./modules/RegisterPage").then(m => ({ default: m.RegisterPage })));
const ProfilePage = lazy(() => import("./modules/ProfilePage").then(m => ({ default: m.ProfilePage })));
const UserProfilePage = lazy(() => import("./modules/UserProfilePage").then(m => ({ default: m.UserProfilePage })));
const AdminPage = lazy(() => import("./modules/AdminPage").then(m => ({ default: m.AdminPage })));
const StoryListPage = lazy(() => import("./modules/story/StoryListPage").then(m => ({ default: m.StoryListPage })));
const UserStoryListPage = lazy(() => import("./modules/story/UserStoryListPage").then(m => ({ default: m.UserStoryListPage })));
const CreateStoryPage = lazy(() => import("./modules/story/CreateStoryPage").then(m => ({ default: m.CreateStoryPage })));
const ReadStoryPage = lazy(() => import("./modules/story/ReadStoryPage").then(m => ({ default: m.ReadStoryPage })));
const UpdateStoryPage = lazy(() => import("./modules/story/UpdateStoryPage").then(m => ({ default: m.UpdateStoryPage })));
const CreateChapterPage = lazy(() => import("./modules/chapter/CreateChapterPage").then(m => ({ default: m.CreateChapterPage })));
const ReadChapterPage = lazy(() => import("./modules/chapter/ReadChapterPage").then(m => ({ default: m.ReadChapterPage })));
const UpdateChapterPage = lazy(() => import("./modules/chapter/UpdateChapterPage").then(m => ({ default: m.UpdateChapterPage })));
const ReadHistoryPage = lazy(() => import("./modules/history/ReadHistoryPage").then(m => ({ default: m.ReadHistoryPage })));
const UserStoriesPage = lazy(() => import("./modules/profile/UserStoriesPage").then(m => ({ default: m.UserStoriesPage })));
const BookmarkPage = lazy(() => import("./modules/bookmark/BookmarkPage").then(m => ({ default: m.BookmarkPage })));
const FeedPage = lazy(() => import("./modules/follow/FeedPage").then(m => ({ default: m.FeedPage })));
const FollowListPage = lazy(() => import("./modules/follow/FollowListPage").then(m => ({ default: m.FollowListPage })));
const CollectionList = lazy(() => import("./modules/collection").then(m => ({ default: m.CollectionList })));
const CollectionDetail = lazy(() => import("./modules/collection").then(m => ({ default: m.CollectionDetail })));
const DiscoverCollections = lazy(() => import("./modules/collection").then(m => ({ default: m.DiscoverCollections })));

// Loading fallback component
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="text-center">
      <div className="h-12 w-12 rounded-full border-4 border-primary border-t-transparent animate-spin mx-auto mb-4"></div>
      <p className="text-lg font-medium">Loading...</p>
    </div>
  </div>
);

const router = createBrowserRouter([
  {
    path: "/",
    element: <NavbarWrapper />,
    children: [
      {
        path: "/",
        element: (
          <Suspense fallback={<PageLoader />}>
            <LandingPage />
          </Suspense>
        ),
      },
      {
        path: "/home",
        element: (
          <Suspense fallback={<PageLoader />}>
            <HomePage />
          </Suspense>
        ),
      },
      {
        path: "/login",
        element: (
          <Suspense fallback={<PageLoader />}>
            <LoginPage />
          </Suspense>
        ),
      },
      {
        path: "/register",
        element: (
          <Suspense fallback={<PageLoader />}>
            <RegisterPage />
          </Suspense>
        ),
      },
      {
        path: "/profile",
        element: (
          <Suspense fallback={<PageLoader />}>
            <ProfilePage />
          </Suspense>
        ),
      },
      {
        path: "/admin",
        element: (
          <Suspense fallback={<PageLoader />}>
            <AdminPage />
          </Suspense>
        ),
      },
      {
        path: "/read",
        element: (
          <Suspense fallback={<PageLoader />}>
            <StoryListPage />
          </Suspense>
        ),
      },
      {
        path: "/your-story",
        element: (
          <Suspense fallback={<PageLoader />}>
            <UserStoryListPage />
          </Suspense>
        ),
      },
      {
        path: "/create-story",
        element: (
          <Suspense fallback={<PageLoader />}>
            <CreateStoryPage />
          </Suspense>
        ),
      },
      {
        path: "/read-story/:storyId",
        element: (
          <Suspense fallback={<PageLoader />}>
            <ReadStoryPage />
          </Suspense>
        ),
      },
      {
        path: "/update-story/:storyId",
        element: (
          <Suspense fallback={<PageLoader />}>
            <UpdateStoryPage />
          </Suspense>
        ),
      },
      {
        path: "/create-chapter/:storyId",
        element: (
          <Suspense fallback={<PageLoader />}>
            <CreateChapterPage />
          </Suspense>
        ),
      },
      {
        path: "/read-chapter/:chapterId",
        element: (
          <Suspense fallback={<PageLoader />}>
            <ReadChapterPage />
          </Suspense>
        ),
      },
      {
        path: "/update-chapter/:chapterId",
        element: (
          <Suspense fallback={<PageLoader />}>
            <UpdateChapterPage />
          </Suspense>
        ),
      },
      {
        path: "/history",
        element: (
          <Suspense fallback={<PageLoader />}>
            <ReadHistoryPage />
          </Suspense>
        ),
      },
      {
        path: "/bookmark",
        element: (
          <Suspense fallback={<PageLoader />}>
            <BookmarkPage />
          </Suspense>
        ),
      },
      {
        path: "/profile/:username",
        element: (
          <Suspense fallback={<PageLoader />}>
            <UserProfilePage />
          </Suspense>
        ),
      },
      {
        path: "/profile/:username/stories",
        element: (
          <Suspense fallback={<PageLoader />}>
            <UserStoriesPage />
          </Suspense>
        ),
      },
      {
        path: "/feed",
        element: (
          <Suspense fallback={<PageLoader />}>
            <FeedPage />
          </Suspense>
        ),
      },
      {
        path: "/follows",
        element: (
          <Suspense fallback={<PageLoader />}>
            <FollowListPage />
          </Suspense>
        ),
      },
      {
        path: "/collections",
        element: (
          <Suspense fallback={<PageLoader />}>
            <CollectionList />
          </Suspense>
        ),
      },
      {
        path: "/collection/:id",
        element: (
          <Suspense fallback={<PageLoader />}>
            <CollectionDetail />
          </Suspense>
        ),
      },
      {
        path: "/discover-collections",
        element: (
          <Suspense fallback={<PageLoader />}>
            <DiscoverCollections />
          </Suspense>
        ),
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

function NavbarWrapper() {
  return (
    <div className="min-h-screen flex flex-col gap-2 w-full items-center relative bg-gradient-to-b from-blue-100 to-blue-300 dark:from-gray-900 dark:to-gray-700">
      <Navbar />
      <Outlet />
    </div>
  );
}

export default App;
