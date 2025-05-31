import Navbar from "./components/Navbar";
import SideMenu from "./components/SideMenu";
import SvgView from "./components/SvgView";
import Editor from "./components/Editor";

function App() {
  return (
    <div className="h-screen flex flex-col">
      <Navbar />
      <div className="flex flex-grow">
        <SideMenu />
        <div className="flex flex-grow">
          <SvgView />
          <Editor />
        </div>
      </div>
    </div>
  );
}

export default App;
