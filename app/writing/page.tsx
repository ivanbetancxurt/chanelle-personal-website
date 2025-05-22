'use client'

import ArticleList from '@/components/ArticleList';
import articles from '@/articles.json';
import { Formik, Form, Field, useFormikContext } from 'formik';
import { useState } from 'react';
import AddArticleButton from '@/components/AddArticleButton';

interface filterValues {
    search: string,
    organization: string,
}

// todo: make responsive

export default function Writing() {
    const initalValues: filterValues = { search: '', organization: 'All' } // initial values of filter form
    const [search, setSearch] = useState(''); // article search state
    const [organization, setOrganization] = useState('All'); // organization choice state
    const [appliedMessageHidden, setAppliedMessageHidden] = useState(true); // filter confirmation showing flag

    return (
        <>
            <div className='relative flex w-full flex-1 justify-center overflow-hidden h-full'>
                <div className='absolute top-0 bottom-0 min-w-200'>
                    <ArticleList articles={articles} search={search} organization={organization} />   
                </div>     
                
                <div className='absolute left-0 top-8 text-2xl'>
                    <Formik
                        initialValues={initalValues}
                        onSubmit={(values) => {
                            setSearch(values.search);
                            setOrganization(values.organization);

                            // display 'Filter applied!' message for 3 seconds after apply button pressed
                            setAppliedMessageHidden(false);
                            setTimeout(() => {
                                setAppliedMessageHidden(true);
                            }, 3000);
                        }}
                    >
                        {() => {
                            return (
                                <Form>
                                    <div className='flex flex-col gap-3'>
                                        <Field id='search' name='search' placeholder='Search articles' className='underline focus:outline-none w-full' />
                                        <div className='flex flex-col'>
                                            <label htmlFor='organization'>Organization:</label>
                                            <Field id='organization' name='organization' as='select' className='focus:outline-none'>
                                                <option>All</option>
                                                <option>The Amherst Student</option>
                                                <option>Santa Fe New Mexican</option>
                                                <option>LANL</option>
                                            </Field>
                                        </div>
                                        
                                        <div className='flex-col space-y-2'>
                                            <button type='submit' className='bg-amber-200 w-fit hover:cursor-pointer hover:bg-amber-300 py-1 px-2 rounded-lg text-xl'>
                                                Apply
                                            </button>
                                            <p className='text-sm text-green-400' hidden={appliedMessageHidden}>
                                                Filter applied!
                                            </p>
                                        </div>
                                        
                                    </div>
                                </Form>
                            );
                        }}
                    </Formik>
                </div>

                <AddArticleButton />
            </div>
        </>
    );
}