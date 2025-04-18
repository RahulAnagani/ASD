import FancySvg from "./FancySvg";
const Spinnit=()=>{
    return (
        <>
        <div className="z-50 w-screen absolute h-screen glassy-metallic flex flex-col justify-center items-center">
            <FancySvg></FancySvg>
            <h1 className="font-bold">Loading</h1>
        </div>
        </>
    )
}
export default Spinnit;