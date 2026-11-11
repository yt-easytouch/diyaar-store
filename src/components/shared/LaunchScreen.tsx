import { motion, useReducedMotion } from "framer-motion";
import mark from "@/assets/diyaar-mark.svg";

/** Same colour as the native splash (assets/splash*.png), so the hand-off is seamless. */
export const LAUNCH_BG = "#00231F";

/** Rings that ripple out from behind the mark, like a new order ringing in. */
const RINGS = [0, 0.7];

/** The animated launch screen: the mark springs in, then breathes while green rings ripple out. */
export function LaunchScreen() {
  const still = useReducedMotion();
  return (
    <motion.div
      className="fixed inset-0 z-[90] flex items-center justify-center"
      style={{ backgroundColor: LAUNCH_BG }}
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.35, ease: "easeOut" } }}
    >
      <motion.div
        className="relative flex items-center justify-center"
        style={{ width: "15vh", height: "15vh" }}
        initial={still ? false : { opacity: 0, scale: 0.6 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 240, damping: 16 }}
      >
        {!still &&
          RINGS.map((delay) => (
            <motion.span
              key={delay}
              className="absolute inset-0 rounded-full border-2 border-[#00E784]"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: [0, 0.5, 0], scale: [0.8, 1.9] }}
              transition={{ duration: 1.4, delay: 0.3 + delay, ease: "easeOut", repeat: Infinity, repeatDelay: 0 }}
            />
          ))}
        <motion.img
          src={mark}
          alt="Diyaar"
          className="relative h-[86%] w-[86%] select-none object-contain"
          draggable={false}
          animate={still ? undefined : { scale: [1, 1.06, 1] }}
          transition={{ duration: 1.4, ease: "easeInOut", repeat: Infinity, delay: 0.3 }}
        />
      </motion.div>
    </motion.div>
  );
}
