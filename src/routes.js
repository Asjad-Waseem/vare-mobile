// import Index1 from "./pages/Index1/Index1";
// import Index2 from "./pages/Index2/Index2";
// import Index3 from "./pages/Index3/Index3";
// import Index4 from "./pages/Index4/Index4";
// import Index5 from "./pages/Index5/Index5";
// import Index6 from "./pages/Index6/Index6";
// import Index10 from "./pages/Index10/Index";
// import  Varehall from "./pages/Varehall/Index";

import ScheduleUI from "./pages/Varehall/VideoUI/info/ScheduleModal";
import MeetingUI from "./pages/Varehall/VideoUI/info/MeetingModal";
// import ConfRoomUI from "./pages/Varehall/VideoUI/info/VideoConfRoom";
import LoginUI from "./pages/Varehall/VideoUI/info/login";
// import NewsUI from "./pages/Varehall/VideoUI/info/NewsStoryModal";
import NewsUI from "./pages/Varehall/VideoUI/info/NewsModal";

import PodcastUI from "./pages/Varehall/VideoUI/info/PodcastModal";
import StoryUI from "./pages/Varehall/VideoUI/info/StoryModal";

import NoticeUI from "./pages/Varehall/VideoUI/info/Notice";
import ProfileUI from "./pages/Varehall/VideoUI/info/Profile";
import StatsUI from "./pages/Varehall/VideoUI/info/StatsModal";
import RegisterUI from "./pages/Varehall/VideoUI/info/Register";
import AddContent from "./pages/Varehall/VideoUI/info/AddContent";

import ContentUI from "./pages/Varehall/VideoUI/info/ContentModal";
import CalendarUI from "./pages/Varehall/VideoUI/info/CalendarModal";
import AppsUI from "./pages/Varehall/VideoUI/info/AppsModal";

const routes = [
  // { path: "/index6", component: Index6 },
  // { path: "/index5", component: Index5 },
  // { path: "/index4", component: Index4 },
  // { path: "/index3", component: Index3 },
  // { path: "/index2", component: Index2 },
  // {path: "/", component: AppsUI},
  // {path: "/chart", component: ChartUI},
  // {path: "/member", component: VareMember},
  // {path: "/media", component: MediaUI},
  // {path: "/content", component: ContentUI},
  {path: "/schedule", component: ScheduleUI},
  {path: "/notice", component: NoticeUI},
  {path: "/podcast", component: PodcastUI},
  {path: "/story", component: StoryUI},

  {path: "/news", component: NewsUI},
  {path: "/meeting", component: MeetingUI},
  {path: "/stats", component: StatsUI},
  // // {path: "/meeting", component: VideoUI},
  // // {path: "/login", component: LoginUI},
  {path: "/register", component: RegisterUI},
  {path: "/profile", component: ProfileUI},
  // {path: "/add", component: AddContent},
  // {path: "/calendar", component: CalendarUI},
  {path: "/login", component: LoginUI},

  // {path: "/confroom", component: ConfRoomUI},
  {path: "/", component: PodcastUI}
  // {path: "/apps", component: AppsUI},
  // {path: "/", component: AppsUI}
];

export default routes;
