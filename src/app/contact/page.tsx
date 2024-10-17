"use client"
import { Button, Input } from "@/components/elements";

const Contact = () => {
    return (
        <div className="flex custom-container gap-[139px] md:gap-5 md:flex-col pt-[73px] pb-[49px] md:pb-20">
            {/* Left Section */}
            <div className="w-1/2 md:w-full flex flex-col justify-center pr-8">
                <h6 className="mb-2">Contact AngelPage</h6>
                <p>
                    Reach out for information on how to sign up, how the platform works, and potential partnerships.
                </p>
                <div className="flex justify-between mt-[60px]">
                    <div className="mb-2">
                        <p className="text-body-caption font-medium">Contact number</p>
                        <p>0000000000</p>
                    </div>
                    <div className="mb-2">
                        <p className="text-body-caption font-medium">Email</p>
                        <p>info@angelpage.org</p>
                    </div>
                </div>
            </div>

            {/* Right Section */}
            <div className="w-1/2 md:w-full flex ">
                <form className="w-full">
                    <div className="flex space-x-6 md:flex-col md:space-x-0 md:space-y-[13px] xl:mt-[13px]">
                        <div className="w-1/2 md:w-full">
                            <Input label='First name' name='firstName' placeholder='Jane' id='firstName' className='flex-col' />
                        </div>

                        <div className="w-1/2 md:w-full">
                            <Input label='Last name' name='lastName' placeholder='Doe' id='lastName' className='flex-col' />
                        </div>
                    </div>
                    <div className="flex space-x-6 md:flex-col md:space-x-0 md:space-y-[13px] xl:mt-[13px]">
                        <div className="w-1/2 md:w-full">
                            <Input label='Email address' name='email' placeholder='janed@angelpage.org' type='email' id='email' className='flex-col' />
                        </div>

                        <div className="w-1/2 md:w-full">
                            <Input label='Phone number' name='phone' placeholder='00000000000' id='phone' className='flex-col' />
                        </div>
                    </div>
                    <div className="w-full mt-[19px]">
                        <Input label='Message' name='message' placeholder='Type message here' id='message' className='flex-col' />
                    </div>
                    <Button type='submit' variant='tertiary' className='mt-[27px]'>Send</Button>
                </form>
            </div>
        </div>
    );
};

export default Contact;
