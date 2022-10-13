import {Card, CardData} from "./Card";

import {createUseStyles} from "react-jss";
import {Theme} from "../styling/theme";

interface CardCollectionProps {
	data: CardData[];
	onLike: (id: number) => void;
}

const useStyles = createUseStyles(
	(theme: Theme) => ({
		collection: {
			maxWidth: 920,
			minWidth: 320,
			width: "100%",
			display: "inline-flex",
			flexWrap: "wrap",
			gap: 15,
			padding: 15,
			margin: 0,
			listStyle: "none",
		},
		wrapper: {
			background: theme.background,
			width: "100%",
			textAlign: "center",
		},
	}),
	{name: "CardCollection"}
);

export const CardCollection = ({data, onLike}: CardCollectionProps) => {
	const {collection, wrapper} = useStyles();

	return (
		<section className={wrapper}>
			<ul className={collection}>
				{data.map((card) => (
					<Card {...card} key={card.id} onLike={onLike}></Card>
				))}
			</ul>
		</section>
	);
};
