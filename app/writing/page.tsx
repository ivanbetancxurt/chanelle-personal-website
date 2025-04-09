'use client'

import ArticleList from '@/components/ArticleList';
import articles from '@/articles.json';
import { Formik, Form, Field } from 'formik';
import { useState } from 'react';

interface filterValues {
    search: string,
    publication: string,
    date: string
}

export default function Writing() {
    const initalValues: filterValues = { search: '', publication: 'All', date: '' }
    const [publication, setPublication] = useState('All');

    return (
        <>
            <div className='relative flex w-full flex-1 justify-center overflow-hidden h-full'>
                <div className='absolute top-0 bottom-0 min-w-200'>
                    <ArticleList articles={articles} publication={publication} />   
                </div>     
                <div className='absolute left-0 top-8 text-2xl'>
                    <Formik
                        initialValues={initalValues}
                        onSubmit={(values, { setSubmitting }) => {
                            setPublication(values.publication);
                        }}
                    >
                        <Form>
                            <div className='flex flex-col gap-3'>
                                <Field id='search' name='search' placeholder='Search articles' className='underline focus:outline-none w-full' />
                                <div className='flex flex-col'>
                                    <label htmlFor='publication'>Publication:</label>
                                    <Field id='publication' name='publication' as='select'>
                                        <option>All</option>
                                        <option>The Amherst Student</option>
                                        <option>Santa Fe New Mexican</option>
                                    </Field>
                                </div>

                                <button type='submit' className='bg-amber-200 w-fit hover:cursor-pointer hover:bg-amber-300 py-1 px-2 rounded-lg text-xl'>
                                    Apply
                                </button>
                            </div>
                        </Form>
                    </Formik>
                </div>
            </div>
        </>
    );
}