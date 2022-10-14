import {createUseStyles} from "react-jss";
import {Theme} from "../styling/theme";
import {ReactComponent as HeartIcon} from "./../media/icons/heart-icon.svg";

export interface CardData {
	id: number;
	images: {
		portrait: string[];
		landscape: string[];
	}[];
	authorName: {
		first: string;
		last: string;
	};
	dateAdded: Date;
	title: string;
	isLiked: boolean;
	likes: number;
}

const useStyles = createUseStyles(
	(theme: Theme) => ({
		card: {
			flexBasis: 220,
			flexGrow: 1,
			flexShrink: 1,
			background: "#FFF",
			borderRadius: 5,
			display: "flex",
			flexDirection: "column",
		},
		contentImage: ({imgSrc}: {imgSrc: string}) => ({
			backgroundImage: `url(${imgSrc})`,
			backgroundSize: "cover",
			width: "100%",
			height: 150,
			borderRadius: [5, 5, 0, 0],
		}),
		authorArea: {
			padding: 15,
			display: "flex",
			alignItems: "center",
			gap: 5,
		},
		nameAndDate: {
			textAlign: "left",
			fontSize: "0.75rem",
		},
		name: {
			color: theme.textDefault,
		},
		date: {
			color: theme.textAccent,
		},
		title: {
			textAlign: "left",
			margin: "0 15px 0 15px",
			flexGrow: 1,
		},
		bottomSection: {
			padding: 15,
			display: "flex",
			justifyContent: "space-between",
			alignItems: "center",
		},
		likes: {
			color: theme.textAccent,
			display: "flex",
			gap: 5,
			alignItems: "center",
			fontSize: "0.75rem",
		},
	}),
	{name: "Card"}
);

export const Card = ({
	id,
	title,
	authorName,
	dateAdded,
	images,
	likes,
	isLiked,
	onLike,
}: CardData & {onLike: (id: number) => void}) => {
	const imgSrc = images[0].landscape[0];

	const classes = useStyles({imgSrc});
	const {card, contentImage, authorArea, nameAndDate} = classes;

	const displayDate = dateAdded.toLocaleString("default", {year: "numeric", month: "long", day: "numeric"});
	const displayName = authorName.first + " " + authorName.last;

	return (
		<li className={card}>
			{/** would be cool to get different imgs for items */}
			<div className={contentImage} role={"img"} />
			<div className={authorArea}>
				<Avatar {...authorName} />
				<div className={nameAndDate}>
					<div className={classes.name}>{displayName}</div>
					<div className={classes.date}>{displayDate}</div>
				</div>
			</div>
			<h3 className={classes.title}>{title}</h3>
			<div className={classes.bottomSection}>
				<LikeButton isLiked={isLiked} onClick={() => onLike(id)} />
				<span className={classes.likes}>
					<HeartIcon />
					{likes} likes
				</span>
			</div>
		</li>
	);
};

const useStylesAva = createUseStyles((theme: Theme) => ({
	avatar: {
		height: 32,
		width: 32,
		flexGrow: 0,
		flexShrink: 0,
		borderRadius: 16,
		backgroundColor: theme.primaryVariant,
		color: "white",
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
	},
}));

export const Avatar = ({first, last}: CardData["authorName"]) => {
	const {avatar} = useStylesAva();

	return (
		<div role={"img"} className={avatar}>
			{first[0]}
			{last[0]}
		</div>
	);
};

const useStylesLikeButton = createUseStyles((theme: Theme) => ({
	likeButton: {
		height: 35,
		width: 100,
		borderRadius: 5,
		borderColor: theme.primary,
		borderStyle: "solid",
		background: (isLiked: boolean) => (isLiked ? theme.primary : "transparent"),
		color: (isLiked: boolean) => (isLiked ? "white" : theme.primary),
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
		cursor: "pointer",
	},
}));

export const LikeButton = ({isLiked, onClick}: {isLiked: boolean; onClick: () => void}) => {
	const classes = useStylesLikeButton(isLiked);

	return (
		<button onClick={onClick} className={classes.likeButton}>
			LIKE
		</button>
	);
};
