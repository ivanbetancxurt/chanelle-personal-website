'use client'

import React, { useState } from 'react';
import { Formik, Form, Field } from 'formik';

interface ArticleFilterFormProps {
    setSearch: (search: string) => void,
    setOrganization: (organization: string) => void
}

interface filterValues {
    search: string,
    organization: string,
}

export default function ArticleFilterForm({ setSearch, setOrganization } : ArticleFilterFormProps) {
    const initalValues: filterValues = { search: '', organization: 'All' } // initial values of filter form
    const [appliedMessageHidden, setAppliedMessageHidden] = useState<boolean>(true); // filter confirmation showing flag

    return (
        <div className='absolute left-0 top-8 text-2xl'>
            <Formik
                initialValues={initalValues}
                onSubmit={values => {
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
                                    <Field id='organization' name='organization' as='select' className='focus:outline-none cursor-pointer'>
                                        <option>All</option>
                                        <option>The Amherst Student</option>
                                        <option>Santa Fe New Mexican</option>
                                        <option>LANL</option>
                                    </Field>
                                </div>
                                
                                <div className='flex flex-col space-y-2 items-center mt-4'>
                                    <button type='submit' className='bg-amber-200 w-fit hover:cursor-pointer hover:bg-amber-300 py-1 px-2 rounded-lg text-2xl'>
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
    );
}
