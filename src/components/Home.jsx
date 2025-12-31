import React from "react";

const Home = () => {
    

  return (
    <div className="flex  justify-between gap-10 px-10 py-10  w-full h-180">
      <div className=" w-1/2  flex flex-col p-20  gap-4">
        <h1 className="mt-10 text-4xl font-bold text-blue-900 leading-[1.2] pt-10 ">
          Split the bill, not the friendship. <br /> We handle the math so you don’t argue. <br /> Simple. Fair. Stress-free. <br />
        </h1>



        <button onClick={() => {
    document
      .getElementById("create-group")
      .scrollIntoView({ behavior: "smooth" });
  }} className="mt-10 w-fit bg-orange-500 text-white px-8 py-2 rounded-full text-22 font-medium hover:bg-orange-600 transition">
          Get Started →
        </button>
      </div>
      <div className="flex  w-1/2 items-center ">
        <img
          width={600}
          height={600}
          src="/Team spirit-pana.png"
          alt="Team Spirit"
        />
      </div>
    </div>

  );
};

export default Home;
