import { useStore } from "~/utils/stores/stores";

interface SoundSelectionProps {
  onSoundChange: (sound: string) => void;
}

export const SoundSelection: React.FC<SoundSelectionProps> = ({
  onSoundChange,
}) => {
  const [soundOptions, soundRef] = useStore((state) => [
    state.soundList,
    state.soundRef,
  ]);
  return (
    <div className=" flex place-content-center pb-6">
      <select
        className="rounded-lg bg-slate-500 p-3 px-5 text-base shadow-lg  sm:p-4 sm:px-6 sm:text-lg"
        value={soundRef}
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
