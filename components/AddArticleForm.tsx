import React, { useState } from 'react';
import { Formik, Form, Field } from 'formik';
import type { Articles } from '@/lib/generated/prisma';
import { getURL, yyyymmddToString } from '@/lib/utils';
import * as yup from 'yup';

export default function AddArticleForm({ onArticleAdded }: { onArticleAdded: (article: Articles) => void}) {
	const [thumbnail, setThumbnail] = useState<File | undefined>(undefined); // state for uploaded thumbnail file

	const initialValues: Articles = { // initial values for the form
		link: '',
		title: '',
		organization: 'The Amherst Student',
		date: '',
		thumbnail: '',
		thumbnailDescription: ''
	}

	const yupSchema = yup.object({ // validation schema
		link: yup.string().required().url(),
		title: yup.string().required(),
		organization: yup.string().required().oneOf(['The Amherst Student', 'Santa Fe New Mexican', 'LANL']),
		date: yup.string().required(),
		thumbnail: yup.string().required(),
		thumbnailDescription: yup.string()
	});

	// upload thumbnail to supabase and add article to table
	async function handleSubmit(values: Articles, { resetForm, setSubmitting }: { resetForm: () => void, setSubmitting: (isSubmitting: boolean) => void }) {
		// null checking thumbnail so that typescript doesn't whine
		if (!thumbnail) {
			console.error('Thumbnail upload is undefined.')
			setSubmitting(false); // chanelle cannot submit so form is not submitting
			return;
		}

		try {
			const validName = thumbnail.name.replace(/\s+/gu, '_'); // make name of thumbnail follow S3 naming conventions

			// create form data for thumbnail that the upload endpoint expects
			const thumbanailFormData = new FormData();
			thumbanailFormData.append('file', thumbnail);
			thumbanailFormData.append('fileName', validName);

			// upload thumbnail to Supabase
			const uploadRes = await fetch('/api/supabase/storage', {
				method: 'POST',
				body: thumbanailFormData
			});

			if (!uploadRes.ok) {
				throw new Error(`There was an error uploading thumbnail to storage: ${uploadRes.status}`);
			}

			const uploadResJson = await uploadRes.json(); // parse json response

			// create article data object
			const articleData = {
				link: values.link,
				title: values.title,
				organization: values.organization,
				date: yyyymmddToString(values.date),
				thumbnail: getURL(uploadResJson.url),
				thumbnailDescription: values.thumbnailDescription
			};

			// submit article to API
			await fetch('/api/supabase/articles', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(articleData)
			}).then(res => {
				if (!res.ok) throw new Error(`There was an error submitting the article: ${res.status}`);
			}).catch(err => {console.error(err);});

			resetForm(); // reset the form to initial values
			setThumbnail(undefined); // clear thumbnail state
			onArticleAdded(articleData); // optimistically update the article list
		} catch (err) {
			console.error('Error creating article:', err);
			alert(`Ah shi, sorry bae this isn't your fault! Take a picture of this for me and I'll try to fix it ASAP! <3 ~~~ ${err}`);
		} finally {
			setSubmitting(false); // form is submitted
		}
	}

	return (
		<div className='absolute bg-gray-100 right-0 w-[260px] top-[100px] p-2 rounded-xl bottom-0'>
			<Formik
				initialValues={initialValues}
				validationSchema={yupSchema}
				onSubmit={(values, { resetForm, setSubmitting }) => {
					handleSubmit(values, { resetForm, setSubmitting }); // submit the article
				}}
			>
				{({ isSubmitting, errors, touched, isValid, setFieldError, setFieldTouched, setFieldValue }) => {
					// update image state every time a file is chosen in the image input
					function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
						const file = e.target.files?.[0];
						setThumbnail(file ?? undefined); // set thumbnail state to uploaded file

						setFieldTouched('thumbnail', true); // tell formik that thumbnail input has been touched
						if (file) {
							setFieldValue('thumbnail', file.name); // tell formik the new value of the input
							setFieldError('thumbnail', undefined); // image has been uploaded so there are no error
						} else {
							setFieldValue('thumbnail', ''); // tell formik there is no uploaded file
							setFieldError('thumbnail', '💔 Cover photo is required!'); // set error message
						}
					}

					// set formik helpers on click and blur of thumbnail input
					function handleClickAndBlur() {
						setFieldTouched('thumbnail', true); // tell formik that thumbnail input has been touched

						// set error if chanelle doesn't select a file
						if (!thumbnail) {
							setFieldError('thumbnail', '💔 Cover photo is required!');
						} else {
							setFieldError('thumbnail', undefined);
						}
					}

					return (
						<Form className='relative flex flex-col gap-2 text-2xl'>
							<Field id='title' name='title' placeholder='Title' className='underline focus:outline-none rounded-md' />
							{errors.title && touched.title ? (<p className='absolute text-sm text-red-500 mt-[30px]'>💔 Title is required!</p>) : null}

							<Field id='link' name='link' placeholder='Link' className='underline focus:outline-none mt-5' />
							{errors.link && touched.link ? (<p className='absolute text-sm text-red-500 mt-[90px]'>💔 Link is required! Make sure it's valid!</p>) : null}

							<label htmlFor='organization' className='mt-5'>Organization:</label>
							<Field id='organization' name='organization' as='select' className='focus:outline-none cursor-pointer'>					
								<option>The Amherst Student</option>
								<option>Santa Fe New Mexican</option>
								<option>LANL</option>
							</Field>

							<label htmlFor='date' className='mt-5'>Date published:</label>
							<Field id='date' name='date' type='date' className='focus:outline-none cursor-pointer' />
							{errors.date && touched.date ? (<p className='absolute text-sm text-red-500 mt-[290px]'>💔 Date is required!</p>) : null}

							<label htmlFor='thumbnail' className='mt-5'>Cover photo:</label>
							<input
								id="thumbnail"
								name="thumbnail"
								type="file"
								accept="image/*"
								disabled={isSubmitting}
								onClick={handleClickAndBlur}
								onBlur={handleClickAndBlur}
								onChange={handleChange}
								className='text-xl'
							/>
							{errors.thumbnail && touched.thumbnail ? (<p className='absolute text-sm text-red-500 mt-[383px]'>💔 Cover photo is required!</p>) : null}

							<Field id='thumbnailDescription' name='thumbnailDescription' placeholder='Photo description (optional)' className='text-xl underline focus:outline-none'></Field>

							<div className='flex justify-center'>
								<button 
									type='submit' 
									disabled={isSubmitting || (!isValid)}
									className='mt-5 bg-amber-200 hover:bg-amber-300 disabled:bg-gray-300 disabled:cursor-not-allowed py-1 px-2 w-fit rounded-lg'
								>
									{isSubmitting ? 'Adding...' : 'Add'}
								</button>
							</div>
						</Form>
					);
				}}
			</Formik>
		</div>
	);
}