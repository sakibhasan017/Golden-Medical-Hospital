"use client";

import Image from "next/image";

export default function ProfileImageUpload({ value, onFileSelect }) {
  return (
    <div className="flex items-center gap-4">
      <div className="w-24 h-24 rounded-full border overflow-hidden shrink-0 bg-white">
        {value ? (
          <Image
            src={value}
            alt="Profile preview"
            width={96}
            height={96}
            className="w-full h-full object-cover"
            unoptimized
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">
            No image
          </div>
        )}
      </div>

      <label className="cursor-pointer px-4 py-2 rounded-md bg-[#0077B6] text-white text-sm">
        Change image
        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => onFileSelect(e.target.files?.[0] || null)}
        />
      </label>
    </div>
  );
}
