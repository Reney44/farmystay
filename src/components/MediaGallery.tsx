"use client";

import { useState } from "react";
import { ImageOff, PlayCircle } from "lucide-react";

type Media = { id: string; url: string; type: "IMAGE" | "VIDEO" };

export default function MediaGallery({ media }: { media: Media[] }) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (media.length === 0) {
    return (
      <div className="flex aspect-video w-full items-center justify-center rounded-xl bg-muted text-muted-foreground">
        <ImageOff className="h-10 w-10" />
      </div>
    );
  }

  const active = media[activeIndex];

  return (
    <div>
      <div className="aspect-video w-full overflow-hidden rounded-xl bg-muted">
        {active.type === "IMAGE" ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={active.url}
            alt=""
            className="h-full w-full object-cover"
          />
        ) : (
          <video
            src={active.url}
            controls
            className="h-full w-full object-cover"
          />
        )}
      </div>

      {media.length > 1 && (
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {media.map((m, i) => (
            <button
              key={m.id}
              onClick={() => setActiveIndex(i)}
              className={`relative h-16 w-24 shrink-0 overflow-hidden rounded-md border-2 ${
                i === activeIndex ? "border-primary" : "border-transparent"
              }`}
            >
              {m.type === "IMAGE" ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={m.url}
                  alt=""
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-black/70">
                  <PlayCircle className="h-6 w-6 text-white" />
                </div>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
