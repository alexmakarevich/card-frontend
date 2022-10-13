import "./App.css";
import {ThemeProvider} from "react-jss";

import {useCards} from "./data/fetcher";
import {theme} from "./styling/theme";
import {CardPage} from "./components/CardPage";

function App() {
	// in a real app, this would be provided as context
	const data = useCards();

	return (
		<ThemeProvider theme={theme}>
			<CardPage data={data ?? []} />
		</ThemeProvider>
	);
}

export default App;
