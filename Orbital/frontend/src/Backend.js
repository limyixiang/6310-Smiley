import axios from "axios";

const VERCEL_URL = "https://6310-smiley-server.vercel.app";
const LOCAL_URL = "http://localhost:8000";
const URL = LOCAL_URL;

//USER AND AUTH ROUTES

//SIGNIN
export const signin = async (user) => {
    // API call to sign in a user
    try {
        const response = await axios.post(
            `${URL}/api/signin`,
            JSON.stringify(user),
            {
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
            }
        );
        return response.data;
    } catch (err) {
        return err.response.data;
    }
};

//SIGNUP
export const signup = async (user) => {
    // API call to sign up a user
    try {
        const response = await axios.post(
            `${URL}/api/signup`,
            JSON.stringify(user),
            {
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
            }
        );
        console.log(response.data);
        return response.data;
    } catch (err) {
        return err.response.data;
    }
};

//FORGETPASSWORD
export const forgetPasswordAuthentication = async (user) => {
    // API call to check if user is in database
    try {
        const response = await axios.post(
            `${URL}/api/forgetpassword`,
            JSON.stringify(user),
            {
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
            }
        );
        return response.data;
    } catch (err) {
        return err.response.data;
    }
};

export const forgetPasswordReset = async (user, token) => {
    // API call to check if user is in database
    try {
        const response = await axios.post(
            `${URL}/api/resetpassword/${token}`,
            JSON.stringify(user),
            {
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
            }
        );
        return response.data;
    } catch (err) {
        return err.response.data;
    }
};

//SETTING THE JWT TOKEN IN USER'S BROWSER
export const authenticate = (data, next) => {
    // Storing JWT token in user's browser
    if (typeof window !== "undefined") {
        localStorage.setItem("jwt", JSON.stringify(data));
        next();
    }
};

//SIGNOUT -> REMOVING JWT TOKEN
export const signout = (next) => {
    // Removing JWT token upon signout
    if (typeof window !== "undefined") {
        localStorage.removeItem("jwt");

        axios
            .get(`${URL}/api/signout`)
            .then((response) => {
                console.log(response.data);
                next();
            })
            .catch((err) => console.log(err));
    }
};

//VALIDATION IF USER IS SIGNED IN
export const isAuthenticated = () => {
    // Checking if the user is authenticated
    if (typeof window === "undefined") {
        return false;
    }
    if (localStorage.getItem("jwt"))
        return JSON.parse(localStorage.getItem("jwt"));
    else return false;
};

// TASK ROUTES

// Create Task
export const createTask = async (task) => {
    // API call to create a task
    try {
        const response = await axios.post(
            `${URL}/tasks/createtask`,
            JSON.stringify(task),
            {
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
            }
        );
        return response.data;
    } catch (err) {
        return err.response.data;
    }
};

// Delete Tasks
export const deleteTask = async (taskId) => {
    try {
        const response = await axios.delete(
            `${URL}/tasks/deletetask/${taskId}`
        );
        return response.data; // Return response data
    } catch (error) {
        console.error(error);
        return { success: false, error: "Error deleting task." };
    }
};

// Get Tasks for User (Sorted By Date)
export const getTasksByDateForUser = async (user) => {
    // API call to get courses
    try {
        const response = await axios.post(
            `${URL}/tasks/gettasksbydateforuser`,
            JSON.stringify(user),
            {
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
            }
        );
        return response.data;
    } catch (err) {
        return err.response.data;
    }
};

// Get Tasks for User (Sorted by Priority)
export const getTasksByPriorityForUser = async (user) => {
    // API call to get courses
    try {
        const response = await axios.post(
            `${URL}/tasks/gettasksbypriorityforuser`,
            JSON.stringify(user),
            {
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
            }
        );
        return response.data;
    } catch (err) {
        return err.response.data;
    }
};

// Get Tasks for Course
export const getTasksByDateForCourse = async (course) => {
    // API call to get courses
    try {
        const response = await axios.post(
            `${URL}/tasks/gettasksbydateforcourse`,
            JSON.stringify(course),
            {
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
            }
        );
        return response.data;
    } catch (err) {
        return err.response.data;
    }
};

// Get Tasks for Course
export const getTasksByPriorityForCourse = async (course) => {
    // API call to get courses
    try {
        const response = await axios.post(
            `${URL}/tasks/gettasksbypriorityforcourse`,
            JSON.stringify(course),
            {
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
            }
        );
        return response.data;
    } catch (err) {
        return err.response.data;
    }
};

// Complete Task
export const completeTask = async (task) => {
    // API call to complete a task
    try {
        const response = await axios.post(
            `${URL}/tasks/completetask`,
            JSON.stringify(task),
            {
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
            }
        );
        return response.data;
    } catch (err) {
        return err.response.data;
    }
};

// Reverse Complete Task
export const reverseCompleteTask = async (task) => {
    // API call to reverse complete a task
    try {
        const response = await axios.post(
            `${URL}/tasks/reversecompletetask`,
            JSON.stringify(task),
            {
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
            }
        );
        return response.data;
    } catch (err) {
        return err.response.data;
    }
};

// COURSE ROUTES

// Create Course
export const createCourse = async (course) => {
    // API call to create a course
    try {
        const response = await axios.post(
            `${URL}/courses/createcourse`,
            JSON.stringify(course),
            {
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
            }
        );
        console.log(response);
        return response.data;
    } catch (err) {
        return { error: err.response.data.error };
    }
};

// Delete Courses
export const deleteCourse = async (courseId) => {
    try {
        const response = await axios.delete(
            `${URL}/courses/deletecourse/${courseId}`
        );
        return response.data; // Return response data
    } catch (error) {
        console.error(error);
        return { success: false, error: "Error deleting course." };
    }
};

// Get Courses
export const getCourses = async (user) => {
    // API call to get courses
    try {
        const response = await axios.post(
            `${URL}/courses/getcourses`,
            JSON.stringify(user),
            {
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
            }
        );
        return response.data;
    } catch (err) {
        return err.response.data;
    }
};
