import { useStore } from "~/utils/stores";

interface SoundOption {
  label: string;
  value: string;
}

interface SoundSelectionProps {
  selectedSound: string;
  onSoundChange: (sound: string) => void;
}

export const SoundSelection: React.FC<SoundSelectionProps> = ({
  selectedSound,
  onSoundChange,
}) => {
  const soundOptions = useStore((state) => state.soundList);
  return (
    <div className=" flex place-content-center pb-6">
      <select
        className="rounded-lg bg-slate-500 p-3 px-5 text-base shadow-lg  sm:p-4 sm:px-6 sm:text-lg"
        value={selectedSound}
        onChange={(e) => {
          console.log(e.target.value);
          onSoundChange(e.target.value);
        }}
      >
        {soundOptions.map((option) => (
          <option key={option.value} value={option.label}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};
