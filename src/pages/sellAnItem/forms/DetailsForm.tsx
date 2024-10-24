import { Button, Input, Select, Textarea } from '@/components/elements';
import React from 'react';

const DetailsForm = () => {
    return (
        <form className="flex flex-col w-full space-y-4">
            <div>
                <Input label='Choose Charity' name='charity' placeholder='Start typing' id='charity' className='flex-col' />
            </div>
            <div>
                <Input label='Item Title' name='item-title' placeholder='Multi-coloured Mules' id='item-title' className='flex-col' />
            </div>
            <div className="flex space-x-6 md:flex-col md:space-x-0 md:space-y-4">
                <div className="w-1/2 md:w-full">
                    <Select label='Category' name='category' id='category' options={['Select', 'Clothing', 'Shoes', 'Accessories']} />
                </div>
                <div className="w-1/2 md:w-full">
                    <Select label='Sub-category' name='subCategory' id='subCategory' options={['Select', 'Casual Shoes', 'Formal Shoes', 'Sports Shoes']} />
                </div>
            </div>
            <div>
                <Select label='Condition' name='condition' id='condition' options={['Select', 'New', 'Used', 'Refurbished']} />
            </div>
            <div>
                <Select label='Brand' name='brand' id='brand' options={['Select', 'Nike', 'Adidas', 'Reebok']} />
            </div>
            <div>
                <Select label='Material' name='material' id='material' options={['Select', 'Leather', 'Textile', 'Synthetic']} />
            </div>
            <div>
                <Select label='Colour' name='colour' id='colour' options={['Select', 'Red', 'Blue', 'Green']} />
            </div>
            <p className='text-body-small'>For clothes and shoes</p>
            <div>
                <Select label='Size' name='size' id='size' options={['Select', 'Small', 'Medium', 'Large']} />
            </div>
            <p className='text-body-small'>For bags, furniture, electronics, and accessories</p>
            <div className='flex gap-2'>
                <Input label='Height' name='height' placeholder='Enter height' id='height' type='number' className='flex-col w-11/12' />
                <Button type='submit' variant='primary' className='self-end w-[35px] h-10'>in</Button>
            </div>
            <div className='flex gap-2'>
                <Input label='Width' name='width' placeholder='Enter width' id='width' type='number' className='flex-col w-11/12' />
                <Button type='submit' variant='primary' className='self-end w-[35px] h-10'>cm</Button>
            </div>
            <div className='flex gap-2'>
                <Input label='Depth (optional)' name='depth' placeholder='Enter' id='depth' type='number' className='flex-col w-11/12' />
                <Button type='submit' variant='primary' className='self-end w-[35px] h-10'>in</Button>
            </div>
            <div>
                <Textarea label='Additional Information' name='additionalInfo' placeholder='Enter any additional information' />
            </div>
            <div className="flex justify-end">
                <Button variant='accend-link' className='flex items-center underline !text-primary-color-100' onClick={() => console.log('Should not click')}>Save as draft</Button>
                <Button type='submit' variant='primary'>Continue</Button>
            </div>
        </form>
    );
};

export default DetailsForm;
