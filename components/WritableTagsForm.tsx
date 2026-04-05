"use client";

import { useTranslations } from "next-intl";
import type { WritableTagFormState } from "@/lib/metadata-writable-tags";

type WritableTagsFormProps = {
  value: WritableTagFormState;
  onChange: (next: WritableTagFormState) => void;
  disabled?: boolean;
};

function updateStringList(
  list: string[],
  index: number,
  item: string,
): string[] {
  const next = [...list];
  next[index] = item;
  return next;
}

function removeStringListIndex(list: string[], index: number): string[] {
  if (list.length <= 1) return [""];
  return list.filter((_, i) => i !== index);
}

function addStringListRow(list: string[]): string[] {
  return [...list, ""];
}

export default function WritableTagsForm({
  value,
  onChange,
  disabled = false,
}: WritableTagsFormProps) {
  const t = useTranslations("WritableTags");
  const v = value;

  function patch(partial: Partial<WritableTagFormState>) {
    onChange({ ...v, ...partial });
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="writable-tag-title"
          className="text-sm font-medium text-slate-700"
        >
          {t("title")}
        </label>
        <input
          id="writable-tag-title"
          type="text"
          value={v.title}
          onChange={(e) => patch({ title: e.target.value })}
          disabled={disabled}
          autoComplete="off"
          className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
        />
      </div>

      <StringListEditor
        label={t("artists")}
        values={v.artistsNames}
        disabled={disabled}
        addLabel={t("addArtist")}
        idPrefix="writable-artist"
        onChange={(next) => patch({ artistsNames: next })}
      />

      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="writable-tag-album"
          className="text-sm font-medium text-slate-700"
        >
          {t("album")}
        </label>
        <input
          id="writable-tag-album"
          type="text"
          value={v.albumName}
          onChange={(e) => patch({ albumName: e.target.value })}
          disabled={disabled}
          autoComplete="off"
          className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
        />
      </div>

      <StringListEditor
        label={t("albumArtists")}
        values={v.albumArtistsNames}
        disabled={disabled}
        addLabel={t("addAlbumArtist")}
        idPrefix="writable-album-artist"
        onChange={(next) => patch({ albumArtistsNames: next })}
      />

      <StringListEditor
        label={t("genres")}
        values={v.genresNames}
        disabled={disabled}
        addLabel={t("addGenre")}
        idPrefix="writable-genre"
        onChange={(next) => patch({ genresNames: next })}
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="writable-tag-rating"
            className="text-sm font-medium text-slate-700"
          >
            {t("rating")}
          </label>
          <input
            id="writable-tag-rating"
            type="number"
            min={0}
            max={100}
            step={1}
            value={v.rating}
            onChange={(e) => patch({ rating: e.target.value })}
            disabled={disabled}
            placeholder={t("optionalPlaceholder")}
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="writable-tag-language"
            className="text-sm font-medium text-slate-700"
          >
            {t("language")}
          </label>
          <input
            id="writable-tag-language"
            type="text"
            value={v.language}
            onChange={(e) => patch({ language: e.target.value })}
            disabled={disabled}
            autoComplete="off"
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>
      </div>
    </div>
  );
}

function StringListEditor({
  label,
  values,
  onChange,
  disabled,
  addLabel,
  idPrefix,
}: {
  label: string;
  values: string[];
  onChange: (next: string[]) => void;
  disabled: boolean;
  addLabel: string;
  idPrefix: string;
}) {
  const t = useTranslations("WritableTags");

  return (
    <fieldset className="m-0 flex flex-col gap-2 border-0 p-0">
      <legend className="mb-1.5 text-sm font-medium text-slate-700">
        {label}
      </legend>
      <ul className="m-0 flex list-none flex-col gap-2 p-0">
        {values.map((item, index) => (
          <li
            key={`${idPrefix}-${index}`}
            className="flex flex-wrap items-center gap-2"
          >
            <input
              id={`${idPrefix}-${index}`}
              type="text"
              value={item}
              onChange={(e) =>
                onChange(updateStringList(values, index, e.target.value))
              }
              disabled={disabled}
              aria-label={t("listItemAria", {
                label,
                index: index + 1,
              })}
              autoComplete="off"
              className="min-w-0 flex-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
            />
            <button
              type="button"
              disabled={disabled}
              onClick={() => onChange(removeStringListIndex(values, index))}
              className="shrink-0 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {t("remove")}
            </button>
          </li>
        ))}
      </ul>
      <button
        type="button"
        disabled={disabled}
        onClick={() => onChange(addStringListRow(values))}
        className="self-start rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {addLabel}
      </button>
    </fieldset>
  );
}
