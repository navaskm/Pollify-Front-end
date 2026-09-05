import { filterBarStyles as s } from "@/public/style/style";
import { Image, List, MessageSquare, Scale, Sparkles, Star, X } from "lucide-react";
import { PollFilter, PollType } from "@/utils/types";

type Filter = {
  key: PollFilter;
  label: string;
  Icon: React.ElementType;
}

export const TYPE_META: Record<
  PollType,
  { label: string; Icon: React.ElementType }
> = {
  yesno: { label: "Yes / No", Icon: Scale },
  single: { label: "Single Choice", Icon: List },
  rating: { label: "Rating", Icon: Star },
  image: { label: "Image", Icon: Image },
  open: { label: "Open Ended", Icon: MessageSquare },
};

export const FILTERS: Filter[] = [
  { key: "all", label: "All", Icon: Sparkles },

  ...Object.entries(TYPE_META).map(([key, v]) => ({
    key: key as PollType,
    label: v.label,
    Icon: v.Icon,
  })),
];

const FilterBar = ({
  value,
  onChange
}:{
  value : PollFilter,
  onChange: (key: PollFilter) => void
}) => {
  return (
    <div className={s.container}>
      {FILTERS.map(({Icon, key, label}) => (
        <button
          key={key}
          onClick={() => onChange(key)}
          className={`${s.filterButtonBase} ${
            value === key ? s.filterButtonActive : s.filterButtonInactive
          }`}
        >
          <Icon size={12} /> {label}
        </button>
      ))}

      {value !== 'all' && (
        <button onClick={() => onChange('all')} className={s.clearButton}>
          <X size={11} /> Clear
        </button>
      )}
    </div>
  );
};

export default FilterBar;