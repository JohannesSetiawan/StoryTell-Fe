export function LandingPage() {
  return (
    <div>
      <div className="mt-8 mb-4">
        <div className="flex justify-center">
          <div className="text-6xl font-bold">Gladi</div>
        </div>
      </div>

      <div className="mt-8 mb-4">
        <div className="flex justify-center">
          <div className="text-3xl font-bold">
            Practice your Public Speaking!
          </div>
        </div>
      </div>

      <div className="py-10">
        <div className="container mx-auto w-4/5">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 text-center mb-12 dark:text-gray-200">
            Features
          </h2>
          <div className="flex flex-row flex-wrap gap-8 justify-center">
            <div className="flex flex-col justify-center items-center border border-gray-300 rounded-lg p-4 hover:scale-110 duration-200 ease-in-out transition-all">
              <div className="rounded-full h-4 w-4 md:h-6 md:w-6 drop-shadow-xl text-start dark:bg-gray-200 dark:text-gray-800 flex items-center justify-center bg-gray-800 text-white">
                1
              </div>
              <h3 className="mt-4 text-xl font-semibold text-gray-800 dark:text-gray-200 text-center">
                Video + Audio Recording
              </h3>
              <p className="text-gray-600 mt-2 text-center dark:text-gray-400">
                Record your practice with in-build recording system.
              </p>
            </div>
            <div className="flex flex-col items-center border border-gray-300 rounded-lg p-4 hover:scale-110 duration-200 ease-in-out transition-all">
              <div className="rounded-full h-4 w-4 md:h-6 md:w-6 drop-shadow-xl text-start dark:bg-gray-200 dark:text-gray-800 flex items-center justify-center bg-gray-800 text-white">
                2
              </div>
              <h3 className="mt-4 text-xl font-semibold text-gray-800 dark:text-gray-200 text-center">
                Speech-to-Text
              </h3>
              <p className="text-gray-600 mt-2 dark:text-gray-400 text-center">
                Turn your recording's audio into text.
              </p>
            </div>
            <div className="flex flex-col items-center border border-gray-300 rounded-lg p-4 hover:scale-110 duration-200 ease-in-out transition-all">
              <div className="rounded-full h-4 w-4 md:h-6 md:w-6 drop-shadow-xl text-start dark:bg-gray-200 dark:text-gray-800 flex items-center justify-center bg-gray-800 text-white">
                3
              </div>
              <h3 className="mt-4 text-xl font-semibold text-gray-800 dark:text-gray-200 text-center">
                Improvement Advices
              </h3>
              <p className="text-gray-600 mt-2 dark:text-gray-400 text-center">
                See what you can improve from your practice with AI.
              </p>
            </div>
            <div className="flex flex-col items-center border border-gray-300 rounded-lg p-4 hover:scale-110 duration-200 ease-in-out transition-all">
              <div className="rounded-full h-4 w-4 md:h-6 md:w-6 drop-shadow-xl text-start dark:bg-gray-200 dark:text-gray-800 flex items-center justify-center bg-gray-800 text-white">
                4
              </div>
              <h3 className="mt-4 text-xl font-semibold text-gray-800 dark:text-gray-200 text-center">
                See All Recording Practices
              </h3>
              <p className="text-gray-600 mt-2 dark:text-gray-400 text-center">
                See all of your practice's recording that you have already made.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
