import { Outlet, RouterProvider, createBrowserRouter } from "react-router-dom";
import "./App.css";
import {
  LandingPage,
  HomePage,
  LoginPage,
  RegisterPage,
  StoryListPage,
  UserStoryListPage,
  CreateStoryPage,
  ReadStoryPage,
  UpdateStoryPage,
  CreateChapterPage
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
        path: "/read/:storyId",
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
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

function NavbarWrapper() {
  return (
    <div className="min-h-screen flex flex-col gap-2 w-full items-center relative">
      <Navbar />
      <Outlet />
    </div>
  );
}

export default App;
