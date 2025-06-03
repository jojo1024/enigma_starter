import React from 'react'
import { FormSelect } from '../../../base-components/Form'
import { IResidence } from '../../../schema/residence.schema'

interface ResidenceFilterProps {
    residences: IResidence[]
    selectedResidence: string
    onResidenceChange: (value: string) => void
}

const ResidenceFilter: React.FC<ResidenceFilterProps> = ({
    residences,
    selectedResidence,
    onResidenceChange
}) => {
    return (
        <div className="col-span-12 sm:col-span-6 lg:col-span-3 intro-y">
            <FormSelect
                value={selectedResidence}
                onChange={(e) => onResidenceChange(e.target.value)}
                className="shadow-md w-full"
            >
                <option value="all">Toutes les résidences</option>
                {residences.map((residence) => (
                    <option key={residence.residenceId} value={residence.residenceId}>
                        {residence.residenceNom}
                    </option>
                ))}
            </FormSelect>
        </div>
    )
}

export default ResidenceFilter 