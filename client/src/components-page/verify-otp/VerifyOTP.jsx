import React from "react";

const VerifyOTP = () => {
  return (
    <div className="bg-slate-300 h-screen flex justify-center items-center">
      <div className="flex flex-col justify-center">
        <div className="rounded-lg bg-white w-[500px] text-center p-2 h-max px-4">
          <Heading label={"Sign In"} />
          <SubHeading label={"Enter your info"} />
          <div className="flex items-center space-x-2 mt-4">
            <div className="pt-4">
              <div className="flex justify-end gap-5">
                <Button disabled={!phone || loading} onClick={requestOtp}>
                  {loading ? <Loader2 className="animate-spin" /> : "Create"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyOTP;
