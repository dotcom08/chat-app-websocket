export default function AuthImagePattern({ title, subtitle }) {
  return (
    <div className="hidden lg:grid place-items-center h-full p-12">
      <div className="max-w-md mx-auto text-center">
        <div className="grid grid-cols-3 gap-3 mb-8 ">
          {[...Array(9)].map((_, index) => {
            return (
              <div
                key={index}
                className={`aspect-square w-full rounded-2xl bg-[#FFAE58]  ${
                  index % 2 === 0 ? "animate-pulse" : ""
                }`}
              ></div>
            );
          })}
        </div>
        <h2 className="text-2xl font-bold mb-4">{title}</h2>
        <p className="text-md font-light">{subtitle}</p>
      </div>
    </div>
  );
}
