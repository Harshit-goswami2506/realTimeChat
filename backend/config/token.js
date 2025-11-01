import jwt from "jsonwebtoken";
const genToken = (id) => {
  try {
    const token = jwt.sign(
      { userId: id }, // payload
      process.env.JWT_SECRET, // secret
      { expiresIn: "2d" } // options
    );
    return token;
  } catch (error) {
    console.log("Error while generating token:", error);
  }
};

export default genToken;
