const hero = () => {
  return (
    <div className="flex justify-center items-center w-fullmb-4">
      {/* Intro Section */}
      <div
        id="table-container"
        className=" px-16 grid grid-cols-2 gap-4 items-center"
      >
        <div className="flex flex-col justify-center rounded shadow-sm">
          <h1 className="text-3xl antialiased font-extrabold font-sans">
            {" "}
            <span className="hover:text-blue-500">
              Visualise
            </span> Your Data Security
          </h1>
          <div id="blurb" className="font-sans text-2xl">
            <p>
              Visualise Your Data Security is an educational initiative
              designed to teach data security principles and best practices.
            </p>
            <br />
            <p>
              From encryption fundamentals to threat modeling, DSU-Explain helps
              individuals and organizations understand how to protect sensitive
              data in an evolving digital landscape. Whether you're a beginner
              or an expert, our content ensures that data security is
              approachable and practical for everyone.
            </p>
          </div>
        </div>
        <div className="flex justify-center">
          <img
            className="object-cover w-auto h-auto"
            src="/transparentLogo.png"
            alt="Stock Image"
          />
        </div>
      </div>
    </div>
  );
};

export default hero;
