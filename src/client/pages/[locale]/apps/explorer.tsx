import { AppFrame } from "@captn/joy/app-frame";
import { CustomScrollbars } from "@captn/joy/custom-scrollbars";
import { TitleBar } from "@captn/joy/title-bar";
import { useVectorStore } from "@captn/react/use-vector-store";
import FolderIcon from "@mui/icons-material/Folder";
import SearchIcon from "@mui/icons-material/Search";
import Box from "@mui/joy/Box";
import Input from "@mui/joy/Input";
import List from "@mui/joy/List";
import ListItem from "@mui/joy/ListItem";
import ListItemButton from "@mui/joy/ListItemButton";
import ListItemContent from "@mui/joy/ListItemContent";
import ListItemDecorator from "@mui/joy/ListItemDecorator";
import Typography from "@mui/joy/Typography";
import { groupBy, uniqBy } from "lodash";
import type { InferGetStaticPropsType } from "next";
import Head from "next/head";
import { useTranslation } from "next-i18next";
import { Fragment, useMemo, useState } from "react";

import { DynamicIcon } from "@/atoms/icons/dynamic";
import { handleCaptainAction } from "@/ions/handlers/action";
import { makeStaticProperties } from "@/ions/i18n/get-static";
import { getContrastColor } from "@/ions/utils/color";

export default function Page(_properties: InferGetStaticPropsType<typeof getStaticProps>) {
	const { t } = useTranslation(["common", "labels"]);
	const [query, setQuery] = useState("");
	const { data } = useVectorStore(query);

	const uniqueData = useMemo(() => uniqBy(data, "payload.id"), [data]);
	const groups = useMemo(
		() =>
			// Group all items by the 'type' found in their payload
			groupBy(uniqueData, item => item.payload.type),
		[uniqueData]
	);

	return (
		<AppFrame
			titleBar={
				<TitleBar color="violet" variant="solid">
					<Typography level="title-md" component="h1" startDecorator={<FolderIcon />}>
						{t("labels:explorer")}
					</Typography>
				</TitleBar>
			}
		>
			<Head>
				<title>{t("labels:explorer")}</title>
			</Head>
			<Box
				sx={{
					position: "absolute",
					inset: 0,
					display: "flex",
					flexDirection: "column",
					py: 1,
					px: 1,
				}}
			>
				<Box sx={{ display: "flex", gap: 2 }}>
					<Box sx={{ flex: 1 }} />
					<Box sx={{ flex: 1, maxWidth: 400 }}>
						<Input
							fullWidth
							aria-label={t("labels:search")}
							value={query}
							endDecorator={<SearchIcon />}
							onChange={event => {
								setQuery(event.target.value);
							}}
						/>
					</Box>
				</Box>

				<Box sx={{ position: "relative", flex: 1 }}>
					<CustomScrollbars>
						<Box sx={{ px: 1, py: 1 }}>
							{Object.entries(groups).map(([key, group]) => (
								<Fragment key={key}>
									<Typography level="title-lg" sx={{ mt: 2, mb: 1.5 }}>
										{t(`labels:${key}`)}
									</Typography>
									<List
										sx={{
											display: "flex",
											flexDirection: "row",
											flexWrap: "wrap",
											gap: 2,
										}}
									>
										{group.map(item => (
											<ListItem
												key={item.id}
												sx={{
													"--focus-outline-offset": "-2px",
												}}
											>
												<ListItemButton
													disabled={item.payload.type !== "app"}
													sx={{
														flexDirection: "column",
														width: 128,
														p: 1,
													}}
													onClick={() => {
														if (item.payload.type === "app") {
															handleCaptainAction(item);
														}
													}}
												>
													<ListItemDecorator
														sx={theme => ({
															m: 0,
															p: 2,
															height: 64,
															width: 64,
															bgcolor:
																item.payload.iconColor ||
																theme.palette.neutral["500"],
															color: getContrastColor(
																item.payload.iconColor ||
																	theme.palette.neutral["500"]
															),
															borderRadius: "md",
														})}
													>
														<DynamicIcon
															sx={{
																fontSize: 32,
																color: "currentColor",
															}}
															icon={
																item.payload.icon ||
																item.payload.type ||
																"none"
															}
														/>
													</ListItemDecorator>
													<ListItemContent
														sx={{ width: "100%", overflow: "hidden" }}
													>
														<Typography
															level="body-sm"
															sx={{ textAlign: "center" }}
														>
															{item.payload.label}
														</Typography>
													</ListItemContent>
												</ListItemButton>
											</ListItem>
										))}
									</List>
								</Fragment>
							))}
						</Box>
					</CustomScrollbars>
				</Box>
			</Box>
		</AppFrame>
	);
}

export const getStaticProps = makeStaticProperties(["common", "texts", "labels"]);

export { getStaticPaths } from "@/ions/i18n/get-static";