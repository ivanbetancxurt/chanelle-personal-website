import React from 'react';
import { Formik, Form, Field } from 'formik';

export default function UpdateResumeForm() {
    return (
        <div className='absolute flex right-[100px] top-[100px] w-[260px] bg-gray-100 p-3 rounded-xl'>
            <Formik
                initialValues={{ resume: '' }}
                onSubmit={() => {}}
            >
                {({ isSubmitting }) => {
                    return (
                        <Form className='flex flex-col w-full gap-5'>
                            <input
                                id='resume'
                                name='resume'
                                type='file'
                                accept='.pdf'
                                disabled={isSubmitting}
                                className='cursor-pointer'
                            />

                            <div className='flex justify-center'>
                                <button 
                                    type='submit'
                                    disabled={isSubmitting}
                                    className='cursor-pointer bg-amber-200 hover:bg-amber-300 disabled:bg-gray-300 disabled:cursor-not-allowed py-1 px-2 w-fit rounded-lg'
                                >
                                    {isSubmitting ? 'Updating...' : 'Update'}
                                </button>
                            </div>
                        </Form>
                    );
                }}
            </Formik>
        </div>
    );
}
