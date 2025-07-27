import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { db } from "@/data/db";
import { type VideoKeyFrame } from "@/data/schema";
import { useProjectId } from "@/data/store";
import { refreshVideoCache } from "@/data/queries";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { TypeIcon } from "lucide-react";
import React from "react";

interface TextOverlayDialogProps {
  frame?: VideoKeyFrame; // Optional frame for edit mode
  trigger?: React.ReactNode; // Optional custom trigger
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function TextOverlayDialog({
  frame,
  trigger,
  open,
  onOpenChange,
}: TextOverlayDialogProps) {
  const queryClient = useQueryClient();
  const projectId = useProjectId();
  const isEditMode = !!frame;

  // Extract text data safely
  const textData = frame?.data.type === "text" ? frame.data : null;

  const [text, setText] = useState(textData?.text || "");
  const [fontSize, setFontSize] = useState(textData?.fontSize || 48);
  const [fontFamily, setFontFamily] = useState(
    textData?.fontFamily || "Arial, sans-serif",
  );
  const [color, setColor] = useState(textData?.color || "#ffffff");
  const [backgroundColor, setBackgroundColor] = useState(
    textData?.backgroundColor || "#000000",
  );
  const [position, setPosition] = useState<"top" | "center" | "bottom">(
    textData?.position || "center",
  );
  const [alignment, setAlignment] = useState<"left" | "center" | "right">(
    textData?.alignment || "center",
  );
  const [opacity, setOpacity] = useState(textData?.opacity || 1);
  const [strokeColor, setStrokeColor] = useState(
    textData?.strokeColor || "#000000",
  );
  const [strokeWidth, setStrokeWidth] = useState(textData?.strokeWidth || 0);

  const addTextOverlay = useMutation({
    mutationFn: async () => {
      const tracks = await db.tracks.tracksByProject(projectId);
      let track = tracks.find((t) => t.type === "text");

      if (!track) {
        const id = await db.tracks.create({
          projectId,
          type: "text",
          label: "Text",
          locked: true,
        });
        const newTrack = await db.tracks.find(id.toString());
        if (!newTrack) throw new Error("Failed to create text track");
        track = newTrack;
      }

      const keyframes = await db.keyFrames.keyFramesByTrack(track.id);
      const lastKeyframe = [...keyframes]
        .sort((a, b) => a.timestamp - b.timestamp)
        .reduce(
          (acc, frame) => {
            if (frame.timestamp + frame.duration > acc.timestamp + acc.duration)
              return frame;
            return acc;
          },
          { timestamp: 0, duration: 0 },
        );

      const newId = await db.keyFrames.create({
        trackId: track.id,
        data: {
          type: "text" as const,
          mediaId: crypto.randomUUID(), // Generate a unique ID for text
          text,
          fontSize,
          fontFamily,
          color,
          backgroundColor,
          position,
          alignment,
          opacity,
          strokeColor,
          strokeWidth,
        },
        timestamp: lastKeyframe
          ? lastKeyframe.timestamp + 1 + lastKeyframe.duration
          : 0,
        duration: 5000, // 5 seconds default
      });
      return db.keyFrames.find(newId.toString());
    },
    onSuccess: () => {
      refreshVideoCache(queryClient, projectId);
      // Reset form
      setText("");
      setFontSize(48);
      setFontFamily("Arial, sans-serif");
      setColor("#ffffff");
      setBackgroundColor("#000000");
      setPosition("center");
      setAlignment("center");
      setOpacity(1);
      setStrokeColor("#000000");
      setStrokeWidth(0);
    },
  });

  const updateTextOverlay = useMutation({
    mutationFn: async () => {
      if (!frame || frame.data.type !== "text")
        throw new Error("No text frame to update");

      await db.keyFrames.update(frame.id, {
        data: {
          type: "text",
          mediaId: frame.data.mediaId,
          text,
          fontSize,
          fontFamily,
          color,
          backgroundColor,
          position,
          alignment,
          opacity,
          strokeColor,
          strokeWidth,
        },
      });
    },
    onSuccess: () => {
      refreshVideoCache(queryClient, projectId);
    },
  });

  const handleSubmit = () => {
    if (isEditMode) {
      updateTextOverlay.mutate();
    } else {
      addTextOverlay.mutate();
    }
  };

  // Close dialog after success
  React.useEffect(() => {
    if (updateTextOverlay.isSuccess || addTextOverlay.isSuccess) {
      onOpenChange?.(false);
    }
  }, [updateTextOverlay.isSuccess, addTextOverlay.isSuccess, onOpenChange]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? "Edit Text Overlay" : "Add Text Overlay"}
          </DialogTitle>
          <DialogDescription>
            Configure the text overlay settings for your video.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="text">Text</Label>
            <Textarea
              id="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Enter your text..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="fontSize">Font Size</Label>
              <Slider
                id="fontSize"
                min={12}
                max={120}
                step={1}
                value={[fontSize]}
                onValueChange={([value]) => setFontSize(value)}
              />
              <span className="text-sm text-muted-foreground">
                {fontSize}px
              </span>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="fontFamily">Font Family</Label>
              <Select value={fontFamily} onValueChange={setFontFamily}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Arial, sans-serif">Arial</SelectItem>
                  <SelectItem value="Times New Roman, serif">
                    Times New Roman
                  </SelectItem>
                  <SelectItem value="Courier New, monospace">
                    Courier New
                  </SelectItem>
                  <SelectItem value="Georgia, serif">Georgia</SelectItem>
                  <SelectItem value="Verdana, sans-serif">Verdana</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="color">Text Color</Label>
              <Input
                id="color"
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="backgroundColor">Background Color</Label>
              <Input
                id="backgroundColor"
                type="color"
                value={backgroundColor}
                onChange={(e) => setBackgroundColor(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="position">Position</Label>
              <Select
                value={position}
                onValueChange={(value: "top" | "center" | "bottom") =>
                  setPosition(value)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="top">Top</SelectItem>
                  <SelectItem value="center">Center</SelectItem>
                  <SelectItem value="bottom">Bottom</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="alignment">Alignment</Label>
              <Select
                value={alignment}
                onValueChange={(value: "left" | "center" | "right") =>
                  setAlignment(value)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="left">Left</SelectItem>
                  <SelectItem value="center">Center</SelectItem>
                  <SelectItem value="right">Right</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="opacity">Opacity</Label>
            <Slider
              id="opacity"
              min={0}
              max={1}
              step={0.1}
              value={[opacity]}
              onValueChange={([value]) => setOpacity(value)}
            />
            <span className="text-sm text-muted-foreground">
              {Math.round(opacity * 100)}%
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="strokeColor">Stroke Color</Label>
              <Input
                id="strokeColor"
                type="color"
                value={strokeColor}
                onChange={(e) => setStrokeColor(e.target.value)}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="strokeWidth">Stroke Width</Label>
              <Slider
                id="strokeWidth"
                min={0}
                max={10}
                step={0.5}
                value={[strokeWidth]}
                onValueChange={([value]) => setStrokeWidth(value)}
              />
              <span className="text-sm text-muted-foreground">
                {strokeWidth}px
              </span>
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button
            onClick={handleSubmit}
            disabled={
              !text.trim() ||
              addTextOverlay.isPending ||
              updateTextOverlay.isPending
            }
          >
            {isEditMode ? "Update" : "Add"} Text
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
