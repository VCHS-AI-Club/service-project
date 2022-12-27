const OppCardSkeleton = () => {
  return (
    <div className="rounded-xl bg-white">
      <div className="m-4 flex items-center justify-between">
        <div className="h-7 w-48 animate-pulse rounded-md bg-gray-300 sm:w-72" />
        <div className="h-10 w-16 animate-pulse rounded-md bg-gray-300" />
      </div>

      <hr className="border-1 my-2 border-gray-300" />

      <div className="m-4 flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <div className="h-4 w-64 animate-pulse rounded-md bg-gray-300 sm:w-96" />
          <div className="h-4 w-40 animate-pulse rounded-md bg-gray-300" />
        </div>

        <div className="flex flex-col items-start gap-4 2xl:flex-row 2xl:justify-between">
          <div className="flex flex-col flex-wrap gap-2 md:flex-row">
            <div className="h-4 w-52 animate-pulse rounded-md bg-gray-300 sm:w-80" />
            <div className="h-4 w-72 animate-pulse rounded-md bg-gray-300 sm:w-64" />
          </div>
          <div className="flex gap-2">
            <div className="h-7 w-12 animate-pulse rounded-3xl bg-gray-300" />
            <div className="h-7 w-16 animate-pulse rounded-3xl bg-gray-300" />
            <div className="h-7 w-14 animate-pulse rounded-3xl bg-gray-300" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default OppCardSkeleton;
