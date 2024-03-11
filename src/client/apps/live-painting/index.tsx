import { useSDK } from "@captn/react/use-sdk";
import { ClickAwayListener } from "@mui/base";
import BrushIcon from "@mui/icons-material/Brush";
import CasinoIcon from "@mui/icons-material/Casino";
import ClearIcon from "@mui/icons-material/Clear";
import DeleteIcon from "@mui/icons-material/Delete";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import PaletteIcon from "@mui/icons-material/Palette";
import PlayIcon from "@mui/icons-material/PlayArrow";
import SaveIcon from "@mui/icons-material/Save";
import StopIcon from "@mui/icons-material/Stop";
import Box from "@mui/joy/Box";
import Button from "@mui/joy/Button";
import CircularProgress from "@mui/joy/CircularProgress";
import Dropdown from "@mui/joy/Dropdown";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import IconButton from "@mui/joy/IconButton";
import ListItemDecorator from "@mui/joy/ListItemDecorator";
import Menu from "@mui/joy/Menu";
import MenuButton from "@mui/joy/MenuButton";
import MenuItem from "@mui/joy/MenuItem";
import Option from "@mui/joy/Option";
import Select from "@mui/joy/Select";
import Sheet from "@mui/joy/Sheet";
import Slider from "@mui/joy/Slider";
import Switch from "@mui/joy/Switch";
import Textarea from "@mui/joy/Textarea";
import Tooltip from "@mui/joy/Tooltip";
import Typography from "@mui/joy/Typography";
import { useAtom } from "jotai";
import { useTranslation } from "next-i18next";
import { useCallback, useEffect, useState } from "react";
import { v4 } from "uuid";

import { clearCounterAtom, imageAtom, imagesAtom, livePaintingOptionsAtom } from "./atoms";
import { DrawingArea } from "./drawing-area";
import { RenderingArea } from "./rendering-area";
import type { IllustrationStyles } from "./text-to-image";
import { illustrationStyles } from "./text-to-image";

import { LOCAL_PROTOCOL } from "#/constants";
import { randomSeed } from "#/number";
import { APP_ID } from "@/apps/live-painting/constants";
import { FlagUs } from "@/atoms/flags/us";
import { ImageRemoveIcon } from "@/atoms/icons";
import { getContrastColor } from "@/ions/utils/color";
import { useLocalizedPath } from "@/organisms/language-select";

export function LivePainting() {
	const { t } = useTranslation(["common", "labels"]);
	const [isOverlay, setIsOverlay] = useState(false);
	const [livePaintingOptions, setLivePaintingOptions] = useAtom(livePaintingOptionsAtom);
	const [, setClearCounter] = useAtom(clearCounterAtom);
	const [brushSizeOpen, setBrushSizeOpen] = useState(false);
	const [prompt, setPrompt] = useState("");
	const [illustrationStyle, setIllustrationStyle] = useState<IllustrationStyles>("childrensBook");
	const [seed, setSeed] = useState(randomSeed());
	const [image] = useAtom(imageAtom);
	const [images, setImages] = useAtom(imagesAtom);
	const [running, setRunning] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	const { send, writeFile } = useSDK<unknown, string>(APP_ID, {
		onMessage(message) {
			console.log(message);
			switch (message.action) {
				case "livePainting:started": {
					setRunning(true);
					setIsLoading(false);
					break;
				}

				case "livePainting:stopped": {
					setRunning(false);
					setIsLoading(false);
					break;
				}

				default: {
					break;
				}
			}
		},
	});
	const { changeLanguage } = useLocalizedPath();

	const saveImage = useCallback(async () => {
		const id = v4();
		const url = await writeFile(`images/${id}.png`, image.split(";base64,").pop()!, {
			encoding: "base64",
		});
		setImages(previousImages => [...previousImages, { id, dataUrl: image, url }]);
	}, [image, setImages, writeFile]);

	useEffect(() => {
		async function handleSave(event: KeyboardEvent) {
			if (event.key === "s" && event.ctrlKey) {
				event.preventDefault();
				await saveImage();
			}
		}

		window.addEventListener("keydown", handleSave);
		return () => {
			window.removeEventListener("keydown", handleSave);
		};
	}, [saveImage]);

	useEffect(() => {
		if (running) {
			send({
				action: "livePainting:settings",
				payload: {
					prompt: [prompt, illustrationStyles[illustrationStyle]].join(", "),
					seed,
				},
			});
		}
	}, [send, prompt, seed, running, illustrationStyle]);

	useEffect(() => {
		function beforeUnload() {
			send({ action: "livePainting:stop", payload: APP_ID });
		}

		window.addEventListener("beforeunload", beforeUnload);
		return () => {
			window.removeEventListener("beforeunload", beforeUnload);
		};
	}, [send]);

	return (
		<Box sx={{ display: "flex", flexDirection: "column", minHeight: "100%" }}>
			<Sheet
				sx={{
					position: "sticky",
					top: 0,
					zIndex: 2,
					display: "flex",
					flexWrap: "wrap",
					alignItems: "center",
					flexShrink: 0,
				}}
			>
				<Box
					sx={{
						display: "flex",
						gap: 1,
						flex: 1,
						px: 1,
						height: 44,
						alignItems: "center",
					}}
				>
					{running ? (
						<Button
							disabled={isLoading}
							startDecorator={isLoading ? <CircularProgress /> : <StopIcon />}
							onClick={() => {
								setIsLoading(true);
								send({ action: "livePainting:stop", payload: APP_ID });
							}}
						>
							{t("labels:stop")}
						</Button>
					) : (
						<Button
							disabled={isLoading}
							startDecorator={isLoading ? <CircularProgress /> : <PlayIcon />}
							onClick={() => {
								setIsLoading(true);
								send({ action: "livePainting:start", payload: APP_ID });
							}}
						>
							{t("labels:start")}
						</Button>
					)}
					<Switch
						checked={isOverlay}
						component="div"
						startDecorator={<Typography>{t("labels:overlay")}</Typography>}
						onChange={_event => {
							setIsOverlay(_event.target.checked);
						}}
					/>
					<Box sx={{ width: 8 }} />
					<Tooltip title={t("labels:color")}>
						<IconButton
							component="label"
							size="md"
							tabIndex={-1}
							aria-label={t("labels:color")}
							sx={{
								"--Icon-color": "currentColor",
								overflow: "hidden",
							}}
							style={{
								backgroundColor: livePaintingOptions.color,
								color: getContrastColor(livePaintingOptions.color),
							}}
						>
							<input
								type="color"
								value={livePaintingOptions.color}
								style={{
									width: "100%",
									height: "100%",
									minWidth: 0,
									opacity: 0,
									position: "absolute",
									inset: 0,
									cursor: "pointer",
								}}
								onChange={event => {
									setLivePaintingOptions(previousState => ({
										...previousState,
										color: event.target.value,
									}));
								}}
							/>
							<PaletteIcon />
						</IconButton>
					</Tooltip>
					<Tooltip
						disableInteractive={false}
						open={brushSizeOpen}
						variant="soft"
						sx={{ p: 0 }}
						placement="bottom-start"
						title={
							<ClickAwayListener
								onClickAway={() => {
									setBrushSizeOpen(false);
								}}
							>
								<Box
									sx={{ display: "flex", width: 300, px: 2, py: 1, gap: 2 }}
									onMouseLeave={() => {
										setBrushSizeOpen(false);
									}}
								>
									<Box
										sx={{
											bgcolor: "background.body",
											color: "text.primary",
											height: 108,
											width: 108,
											flexShrink: 0,
											display: "flex",
											alignItems: "center",
											justifyContent: "center",
										}}
									>
										<Box
											style={{ width: livePaintingOptions.brushSize }}
											sx={{
												bgcolor: "text.primary",
												aspectRatio: 1,
												borderRadius: "50%",
											}}
										/>
									</Box>
									<Slider
										min={1}
										max={100}
										step={1}
										value={livePaintingOptions.brushSize}
										slotProps={{
											input: { autoFocus: true },
										}}
										onChange={(event, value) => {
											setLivePaintingOptions(previousState => ({
												...previousState,
												brushSize: value as number,
											}));
										}}
									/>
								</Box>
							</ClickAwayListener>
						}
					>
						<Tooltip title={t("labels:brushSize")} sx={{ py: 0.5, px: 0.75 }}>
							<IconButton
								size="md"
								aria-label={t("labels:brushSize")}
								sx={{ flexShrink: 0 }}
								onClick={() => {
									setBrushSizeOpen(true);
								}}
							>
								<BrushIcon />
							</IconButton>
						</Tooltip>
					</Tooltip>
					<Box sx={{ flex: 1 }} />
					<Tooltip title={t("labels:randomize")}>
						<IconButton
							size="md"
							aria-label={t("labels:randomize")}
							sx={{ flexShrink: 0 }}
							onClick={() => {
								setSeed(randomSeed());
							}}
						>
							<CasinoIcon />
						</IconButton>
					</Tooltip>
					<Select variant="plain" defaultValue="sd-turbo">
						<Option value="sd-turbo">SD Turbo</Option>
					</Select>

					<Tooltip title={t("labels:clear")}>
						<IconButton
							size="md"
							aria-label={t("labels:clear")}
							onClick={() => {
								setClearCounter(previousState => previousState + 1);
							}}
						>
							<ClearIcon />
						</IconButton>
					</Tooltip>
				</Box>
				<Box
					sx={{
						display: "flex",
						gap: 1,
						flex: 1,
						px: 1,
						overflow: "hidden",
						alignItems: "center",
						flexShrink: 0,
						height: 44,
					}}
				>
					<Box sx={{ flex: 1, overflowX: "auto" }}>
						<Box sx={{ display: "flex", gap: 1 }}>
							{images.map(image_ => (
								<Tooltip
									key={image_.id}
									disableInteractive={false}
									title={
										<Box sx={{ position: "relative" }}>
											<IconButton
												aria-label={t("labels:delete")}
												size="sm"
												color="danger"
												variant="solid"
												sx={{ position: "absolute", top: 0, right: 0 }}
												onClick={() => {
													setImages(previousState =>
														previousState.filter(
															({ id }) => id !== image_.id
														)
													);
												}}
											>
												<DeleteIcon />
											</IconButton>
											<Box
												component="img"
												src={`${LOCAL_PROTOCOL}://${image_.url}`}
												alt=""
												sx={{ height: 300, width: "auto" }}
											/>
										</Box>
									}
								>
									<Box
										component="img"
										src={`${LOCAL_PROTOCOL}://${image_.url}`}
										alt=""
										sx={{ height: 36, width: "auto" }}
									/>
								</Tooltip>
							))}
						</Box>
					</Box>

					<Dropdown>
						<MenuButton slots={{ root: IconButton }}>
							<MoreVertIcon />
						</MenuButton>
						<Menu>
							<MenuItem onClick={saveImage}>
								<ListItemDecorator sx={{ color: "inherit" }}>
									<SaveIcon />
								</ListItemDecorator>
								{t("labels:saveImage")}
							</MenuItem>
							<MenuItem
								onClick={() => {
									setImages([]);
								}}
							>
								<ListItemDecorator sx={{ color: "inherit" }}>
									<ImageRemoveIcon />
								</ListItemDecorator>
								{t("labels:removeAllImages")}
							</MenuItem>
						</Menu>
					</Dropdown>
				</Box>
			</Sheet>
			<Sheet
				sx={{
					flex: 1,
					display: "flex",
					flexWrap: "wrap",
					py: 2,
					position: "relative",
					justifyContent: "center",
				}}
			>
				<Box
					sx={{
						width: {
							xs: "100%",
							md: isOverlay ? "100%" : "50%",
						},
						minWidth: "min-content",
						position: isOverlay ? "absolute" : "relative",
						inset: 0,
						zIndex: 1,
						p: 1,
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
					}}
				>
					<DrawingArea isOverlay={isOverlay} />
				</Box>
				<Box
					sx={{
						width: {
							xs: "100%",
							md: isOverlay ? "100%" : "50%",
						},
						minWidth: "min-content",
						position: "relative",
						flex: isOverlay ? 1 : undefined,
						zIndex: 0,
						p: 1,
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
					}}
				>
					<RenderingArea />
				</Box>
			</Sheet>
			<Sheet
				variant="soft"
				sx={{
					display: "flex",
					gap: 1,
					flexDirection: { xs: "column", md: "row" },
					px: 1,
					py: 2,
				}}
			>
				<FormControl sx={{ minWidth: 200 }}>
					<FormLabel>{t("labels:artStyle")}</FormLabel>
					<Select
						value={illustrationStyle}
						renderValue={option =>
							option && (
								<Typography>
									{t(`labels:illustrationStyles.${option.value}`)}
								</Typography>
							)
						}
						onChange={(_event, value_) => {
							if (value_) {
								setIllustrationStyle(value_);
							}
						}}
					>
						{Object.entries(illustrationStyles).map(([key_]) => (
							<Option
								key={key_}
								value={key_}
								sx={{ flexDirection: "column", alignItems: "stretch" }}
							>
								<Typography>{t(`labels:illustrationStyles.${key_}`)}</Typography>
								{key_ === "custom" && (
									<Typography level="body-xs" component="div">
										{t(`labels:illustrationStyles.customInfo`)}
									</Typography>
								)}
							</Option>
						))}
					</Select>
				</FormControl>
				<FormControl sx={{ flex: 1 }}>
					<FormLabel>{t("labels:prompt")}</FormLabel>
					<Textarea
						minRows={3}
						maxRows={3}
						value={prompt}
						startDecorator={
							<Typography startDecorator={<FlagUs />} level="body-xs">
								{t("labels:promptInfo")}
							</Typography>
						}
						onChange={event => {
							setPrompt(event.target.value);
						}}
					/>
				</FormControl>
			</Sheet>
		</Box>
	);
}
