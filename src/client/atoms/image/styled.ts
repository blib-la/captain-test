import { styled } from "@mui/joy/styles";
import Image from "next/image";

export const StyledImage = styled(Image)({
	aspectRatio: 1,
	objectFit: "contain",
	objectPosition: "center",
	width: "100%",
	height: "auto",
});
