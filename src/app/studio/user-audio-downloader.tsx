import React, { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import { ref, listAll, getDownloadURL } from "firebase/storage";
import { useAuthState } from "react-firebase-hooks/auth";
import { initFirebase, storageBucket } from "~/utils/firebase";
interface UserSounds {
  //   onSoundChange: (sound: string) => void;
}
export interface SoundOption {
  label: string;
  value: string;
}
const UserSounds: React.FC<UserSounds> = ({}) => {
  const app = initFirebase();
  const auth = getAuth(app);
  const [user] = useAuthState(auth);
  const [userSounds, setUserSounds] = useState<SoundOption[]>([]);

  useEffect(() => {
    const fetchUserSounds = async () => {
      if (user) {
        const soundsRef = ref(storageBucket, `customers/${user.uid}/sounds`);

        try {
          const soundsList = await listAll(soundsRef);
          soundsList.items.map((item) => {
            getDownloadURL(item).then((url) => {
              const soundObj = { label: item.name, value: url };
              setUserSounds((prev) => {
                if (
                  !prev.some(
                    (element) =>
                      element.label === soundObj.label &&
                      element.value === soundObj.value,
                  )
                ) {
                  return [...prev, soundObj];
                } else {
                  return prev;
                }
              });
            });
          });
        } catch (error) {
          console.error("Error fetching user sounds:", error);
        }
      }
    };

    fetchUserSounds();
  }, [user]);

  return (
    <div>
      <div className="py-3 text-2xl font-bold">User Sounds</div>
      {userSounds.length > 0 ? (
        <div className=" flex place-content-center pb-6">
          <select
            className="rounded-lg bg-slate-500 p-3 px-5 text-base shadow-lg  sm:p-4 sm:px-6 sm:text-lg"
            onChange={(e) => {
              console.log(e.target.value);
              //   onSoundChange(e.target.value);
            }}
          >
            {userSounds.map((option) => (
              <option key={option.value} value={option.label}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      ) : (
        <p>No sounds found for the user.</p>
      )}
    </div>
  );
};

export default UserSounds;
