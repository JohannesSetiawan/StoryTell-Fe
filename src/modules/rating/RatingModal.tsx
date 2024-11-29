import { useState } from "react";
import SliderPicker from "../../components/common/NumberSlider";
import { useCreateRatingMutation, useUpdateRatingMutation } from "../../redux/api/ratingApi";
import toast from "react-hot-toast";
import { Button } from "../../components/common";


export default function RatingModal(props: any) {

    const [rate, setRate] = useState(5)
    const [isLoading, setIsLoading] = useState(false);
    const [createRating] = useCreateRatingMutation()
    const [updateRating] = useUpdateRatingMutation()

    const handleChange = (value: number) => {
        setRate(value)
    };

    const handleSubmit = async() => {
        setIsLoading(true)
        const body = {rate}
        if(props.prevRating){
            await updateRating({ updateData: body, ratingId: props.prevRating }).then((res) => {
                if (res) {
                  if ("data" in res) {
                    toast.success("Update rating success!");
                  } else if ("data" in res.error) {
                    const errorData = res.error.data as { message: string };
                    toast.error(errorData.message);
                  } else {
                    toast.error("Unknown error!");
                  }
                }
            });
        } else{
            await createRating({ body, storyId: props.storyId }).then((res) => {
                if (res) {
                  if ("data" in res) {
                    toast.success("Rating success!");
                  } else if ("data" in res.error) {
                    const errorData = res.error.data as { message: string };
                    toast.error(errorData.message);
                  } else {
                    toast.error("Unknown error!");
                  }
                }
            });
        }
        setIsLoading(false)
        props.toggler()
    }

  return (
    <div className="static">
      <div className="fixed inset-0 z-20 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-80 bg-white border-2 rounded-lg shadow-lg">
            <div className="flex justify-end">
                <Button 
                    onClick={() => props.toggler()}
                    className="border-2 px-2 m-2"
                >
                    Close
                </Button>
            </div>
            <div className=" bg-white">
                <div className="flex justify-between px-6 py-1">
                    <div className="font-bold text-xl">Rate this story!</div>
                </div>
                <div className="flex justify-around items-center px-2 py-1">
                    <SliderPicker onChange={handleChange}/>
                </div>
                <div className="flex justify-around items-center px-2 py-1">
                    <Button className="border-2 rounded-lg px-2 py-1 rounded bg-green-500 text-white font-bold font-mono text-lg"
                        onClick={handleSubmit}
                        loading={isLoading}
                    >Submit</Button>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}