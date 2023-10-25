export default function Loading() {
  // You can add any UI inside Loading, including a Skeleton.
  return (
    <div className=" gap-8 p-4  md:p-8 lg:p-12">
      <div className="flex flex-col place-content-center gap-x-5 gap-y-5">
        <div className="place-content center flex flex-col gap-y-5 ">
          <div className="pt-24 text-center md:pt-4">
            <img
              className="mx-auto block    h-auto w-32 rounded-full md:h-auto md:w-48 lg:h-auto lg:w-64"
              alt="Chut application logo"
            />
          </div>
          <div className="text-center">
            <div className="mb-1 text-slate-500"></div>
            <div className="text-xl text-slate-300"></div>
          </div>
          <div className="flex h-48 w-72 place-content-center text-center"></div>
        </div>
      </div>
    </div>
  );
}
