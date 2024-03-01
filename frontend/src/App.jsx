import { Landing } from "./pages/Landing.jsx";
import SideMenu from "./components/SideMenu";
import { DatabasePage } from "./pages/Database.jsx";

function App() {
	return (
		<div className="flex flex-row h-screen">
			<SideMenu />

			<div id="content">
				<Landing />
			</div>
		</div>
	);

  }

export default App;
