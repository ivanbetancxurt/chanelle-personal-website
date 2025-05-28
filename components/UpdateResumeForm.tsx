import React, { useState } from 'react';
import { Formik, Form } from 'formik';
import * as yup from 'yup';

export default function UpdateResumeForm({ onResumeUpdated }: { onResumeUpdated: () => void }) {
    const [resume, setResume] = useState<File | undefined>(undefined); // state for uploaded resume file

    // validation schema
    const yupSchema = yup.object({ 
        resume: yup.string().required()
    });

    // update resume 
    async function handleSubmit({ resetForm, setSubmitting }: { resetForm: () => void, setSubmitting: (isSubmitting: boolean) => void }) {
        // null checking resume so that typescript doesn't whine
        if (!resume) {
            console.error('Resume upload value is undefined.')
			setSubmitting(false); // chanelle cannot submit so form is not submitting
			return;
        }

        try {
            // create form data for resume that the upload endpoint expects
			const resumeFormData = new FormData();
			resumeFormData.append('file', resume);

            // upload thumbnail to Supabase
			const uploadRes = await fetch('/api/supabase/resume', {
				method: 'POST',
				body: resumeFormData
			});

            if (!uploadRes.ok) {
                throw new Error(`There was an error updating resume: ${uploadRes.status}`);
            }

            resetForm(); // reset the form to initial values
			setResume(undefined); // clear thumbnail state
        } catch(err) {
            console.error('Error updating resume:', err);
			alert(`Ah shi, sorry bae this isn't your fault! Take a picture of this for me and I'll try to fix it ASAP! <3 ~~~ ${err}`);
        } finally {
            setSubmitting(false); // form is submitted
        }
    }

    return (
        <div className='absolute flex right-[100px] top-[100px] w-[260px] bg-gray-100 p-3 rounded-xl'>
            <Formik
                initialValues={{ resume: '' }}
                validationSchema={yupSchema}
                onSubmit={(values, { resetForm, setSubmitting }) => {
                    handleSubmit({ resetForm, setSubmitting });
                }}
            >
                {({ isSubmitting, setFieldValue, setFieldError, setFieldTouched, isValid, errors, touched }) => {
                    // update resume state every time a file is chosen in the input
					function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
						const file = e.target.files?.[0];
						setResume(file ?? undefined); // set resume state to uploaded file

						setFieldTouched('resume', true); // tell formik that resume input has been touched
						if (file) {
							setFieldValue('resume', file.name); // tell formik the new value of the input
							setFieldError('resume', undefined); // resume has been uploaded so there are no error
						} else {
							setFieldValue('resume', ''); // tell formik there is no uploaded file
							setFieldError('resume', '💔 Cover photo is required!'); // set error message
						}
					}

					// set formik helpers on click and blur of resume input
					function handleClickAndBlur() {
						setFieldTouched('resume', true); // tell formik that resume input has been touched

						// set error if chanelle doesn't select a file
						if (!resume) {
							setFieldError('resume', '💔 Cover photo is required!');
						} else {
							setFieldError('resume', undefined);
						}
					}

                    return (
                        <Form className='flex flex-col w-full gap-5'>
                            <input
                                id='resume'
                                name='resume'
                                type='file'
                                accept='.pdf'
                                disabled={isSubmitting}
                                onChange={handleChange}
                                onClick={handleClickAndBlur}
                                onBlur={handleClickAndBlur}
                                className='text-xl cursor-pointer'
                            />
                            {errors.resume && touched.resume ? (<p className='absolute text-sm text-red-500 mt-[25px]'>💔 Resume is required!</p>) : null}

                            <div className='flex justify-center'>
                                <button 
                                    type='submit'
                                    disabled={isSubmitting || !isValid}
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
