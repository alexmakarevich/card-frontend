import {render, screen, within} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {ThemeProvider} from "react-jss";

import {theme} from "../styling/theme";
import {Card, CardData} from "./Card";

describe(Card.name, () => {
	let mockData: CardData & {onLike: () => void} = beforeEach(() => {});

	beforeEach(() => {
		mockData = {
			id: 99,
			images: [
				{
					portrait: ["img-url"],
					landscape: ["img-url"],
				},
			],
			authorName: {
				first: "First",
				last: "Last",
			},
			dateAdded: new Date("2003-11-02"),
			title: "A good title",
			isLiked: false,
			likes: 33,
			onLike: () => {},
		};
	});

	const renderCard = () => {
		render(
			<ThemeProvider theme={theme}>
				<Card {...mockData} />
			</ThemeProvider>
		);
	};

	it("renders the card", async () => {
		renderCard();
		expect(screen.getByRole("listitem")).toBeInTheDocument();
	});

	it("renders the title", async () => {
		renderCard();
		const card = screen.getByRole("listitem");
		const title = within(card).getByRole("heading");
		expect(title).toHaveTextContent("A good title");
	});

	it("renders the image and avatar", async () => {
		renderCard();
		const imgs = screen.getAllByRole("img");
		expect(imgs.length).toEqual(2);
		expect(imgs[0]).toHaveStyle({backgroundImage: "url(img-url)"});
		expect(imgs[1]).toHaveTextContent("FL");
	});

	it("triggers onLike when pressing like button", async () => {
		const mockCallback = jest.fn();
		mockData.onLike = mockCallback;
		renderCard();
		const btn = screen.getByRole("button");
		userEvent.click(btn);
		expect(mockCallback).toHaveBeenCalledWith(mockData.id);
	});
});
