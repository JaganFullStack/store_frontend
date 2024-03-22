export const strings = {
    commonErrors: {
        somethingWrong: "something went wrong",
        systemError: "System Error`",
        notFound:"Url not found",
        success:"Successfully done",
        failed:"failed",
        unauthorize:"Unauthorize"
    },
    validationErrors: {
        nameErrors: {
            invalidName: "Name is invalid",
            name: "Name is required",
        },
        emailErrors: {
            invalidEmail: "Email Id is invalid",
            email: "Email Id is required",
        },
        passwordErrors: {
            password: "Password is required",
            newPassword: "old password is required",
            oldPassword: "New password is required",
            confirmPassword: "Confirm password is required",
            incorrectPassword: "Confirm password is incorrect",
            invalidPassword: "Password is invalid",
            minLength:"Required minimum length 6 ",
            maxlength:"You extist a maximum length for password",
            invalidNewPassword: "New password is invalid",
            invalidOldPassword: "Invalid old password",
            invalidConfirmPassword: "Invalid confirm password",
        },
        otpErrors: {
            invalidOtp: "Invalid OTP",
            otp: "OTP is required",
            length:"Please enter a valid OTP"
        },
        mobileErrors: {
            mobileNumber: "Mobile Number is required",
            invalidMobileNumber: "Mobile Number is invalid",
            length: "Please enter a valid mobile number"
        },
        roleErrors: {
            role: "Minimum one role is required",
            limitExits: "You slected a more role's",
            invalidRole: "Role is invalid",
        },
        skillErrors: {
            skill: "Minimum one skill is required",
            limitExits: "You slected a more skill's",
            invalidRole: "Skill is invalid",
        },
        limitErrors: {
            limitExist: "Your login limit exists",
        },
        descriptionErrors: {
            description: "Description is invalid",
        }
    }
};