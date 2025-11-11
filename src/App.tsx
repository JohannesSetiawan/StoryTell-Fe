import { Outlet, RouterProvider, createBrowserRouter } from "react-router-dom";
import "./App.css";
import {
  LandingPage,
  HomePage,
  LoginPage,
  RegisterPage,
  ProfilePage,
  AdminPage,
  StoryListPage,
  UserStoryListPage,
  CreateStoryPage,
  ReadStoryPage,
  UpdateStoryPage,
  CreateChapterPage,
  ReadChapterPage,
  UpdateChapterPage
} from "./modules";
import { Navbar } from "./components";

const router = createBrowserRouter([
  {
    path: "/",
    element: <NavbarWrapper />,
    children: [
      {
        path: "/",
        element: <LandingPage />,
      },
      {
        path: "/home",
        element: <HomePage />,
      },
      {
        path: "/login",
        element: <LoginPage />,
      },
      {
        path: "/register",
        element: <RegisterPage />,
      },
      {
        path: "/profile",
        element: <ProfilePage />,
      },
      {
        path: "/admin",
        element: <AdminPage />,
      },
      {
        path: "/read",
        element: <StoryListPage />,
      },
      {
        path: "/your-story",
        element: <UserStoryListPage />,
      },
      {
        path: "/create-story",
        element: <CreateStoryPage />,
      },
      {
        path: "/read-story/:storyId",
        element: <ReadStoryPage />,
      },
      {
        path: "/update-story/:storyId",
        element: <UpdateStoryPage />,
      },
      {
        path: "/create-chapter/:storyId",
        element: <CreateChapterPage />,
      },
      {
        path: "/read-chapter/:chapterId",
        element: <ReadChapterPage />,
      },
      {
        path: "/update-chapter/:chapterId",
        element: <UpdateChapterPage />,
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
