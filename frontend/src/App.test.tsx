// @ts-ignore
import {render, screen, act, within, RenderResult} from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import App from "./App";
import {CardDataFromApi} from "./data/fetcher";

// TODO: get rid of all the acts
// TODO: fix the warnings
describe(App.name, () => {
	let mockData: CardDataFromApi[] = beforeEach(() => {});

	beforeAll(() => {
		//@ts-ignore
		global.fetch = jest.fn(() =>
			Promise.resolve({
				json: () => Promise.resolve(undefined),
			})
		);
	});

	beforeEach(() => {
		mockData = [
			{
				id: 99,
				images: [
					{
						portrait: ["img-url"],
						landscape: ["img-url"],
					},
				],
				author: "First Last",
				dateAdded: "2003-11-02",
				title: "A good title",
				likes: 33,
			},
			{
				id: 300,
				images: [
					{
						portrait: ["img-url"],
						landscape: ["img-url"],
					},
				],
				author: "Another Author",
				dateAdded: "2022-11-02",
				title: "One more Title",
				likes: 80,
			},
		];

		// //@ts-ignore
		global.fetch = jest.fn(() =>
			Promise.resolve({
				json: () => Promise.resolve(mockData),
			})
		) as jest.Mock;
	});

	it("renders the cards", async () => {
		// eslint-disable-next-line testing-library/no-unnecessary-act
		await act(() => {
			render(<App />);
		});
		const cards = screen.getAllByRole("listitem");

		expect(within(cards[0]).getByText("A good title")).toBeInTheDocument();
		expect(within(cards[1]).getByText("One more Title")).toBeInTheDocument();

		expect(cards.length).toEqual(2);
	});

	it("filters via checkbox", async () => {
		// eslint-disable-next-line testing-library/no-unnecessary-act
		await act(() => {
			render(<App />);
		});
		const latestCheck = screen.getByRole("checkbox");

		// eslint-disable-next-line testing-library/no-unnecessary-act
		await act(() => {
			userEvent.click(latestCheck);
		});

		const cards = screen.getAllByRole("listitem");
		expect(cards.length).toEqual(1);

		// eslint-disable-next-line testing-library/no-unnecessary-act
		await act(() => {
			userEvent.click(latestCheck);
		});

		const cardsAgain = screen.getAllByRole("listitem");
		expect(cardsAgain.length).toEqual(2);
	});
});
