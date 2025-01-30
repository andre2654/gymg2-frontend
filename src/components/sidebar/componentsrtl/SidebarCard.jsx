import small_logo from "assets/svg/small_logo.svg";

const FreeCard = () => {
  return (
    <div className="relative mt-14 flex w-[256px] justify-center rounded-[20px] bg-gradient-to-br from-[#868CFF] via-[#432CF3] to-brand-500 pb-4">
      <div className="absolute -top-12 flex h-24 w-24 items-center justify-center rounded-full border-[4px] border-white bg-gradient-to-b from-[#868CFF] to-brand-500 dark:!border-navy-800">
      <img src={small_logo} className="h-10 w-auto rounded-full" alt="2TRAINER" style={{ width: '150px', height: 'auto' }} />
      </div>

      <div className="mt-16 flex h-fit flex-col items-center">
        <p className="text-lg font-bold text-white">Upgrade to PRO</p>
        <p className="mt-1 px-4 text-center text-sm text-white">
          Improve your development process and start doing more with 2TRAINER
          PRO!
        </p>

        <a
          target="blank"
          className="text-medium mt-7 block rounded-full bg-gradient-to-b from-white/50 to-white/10 py-[12px] px-11 text-center text-base text-white hover:bg-gradient-to-b hover:from-white/40 hover:to-white/5 "
          href=" "
        >
          Upgrade to PRO
        </a>
      </div>
    </div>
  );
};

export default FreeCard;
