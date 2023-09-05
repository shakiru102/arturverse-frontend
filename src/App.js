import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Root from "./routes/Root";
import Context from "./context/Context";
import NavBar from "./components/NavBar";
import Nft from "./routes/Nft";
import UserNft from "./routes/UserNft";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    
  },
  {
    path: "/nft",
    element: <UserNft />,
    
  },
  {
    path: "/nft/:nftId",
    element: <Nft />,
    
  }
]);


function App() {
  return (
    <Context>
    <div className="h-screen overflow-scroll bg-gray-900">
     <NavBar />
     <RouterProvider  router={router} />
     </div>
    </Context>
  );
}

export default App;
