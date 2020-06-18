import serverInfo from 'src/config/server.json'

export const PatientInfoService = {
    download: async (pid) => {
        const bs = await fetch(`http://${serverInfo.ip}:${serverInfo.port}/patient_info?pid=${pid}`)
        const data = await bs.json()

        const patient = preparePatientData(data.patient)
        const observations = prepareObservationData(data.observation)
        const medications = prepareMedicationData(data.medicationRequest)

        return { patient, observations, medications }
    }
}

function prepareObservationData(observations) {
    const dataToVisualise = {}

    for (const o of observations) {
        const { effectiveDateTime, valueQuantity, component } = o

        const observationType = o.code.text
        if (valueQuantity) {
            var { value, unit } = valueQuantity
        } else {
            var components = component?.map(c => {
                const observationType = c.code.text
                const { value, unit } = c.valueQuantity
                return {
                    observationType, value: `${Number(Number.parseFloat(value).toFixed(1))} ${unit}`
                }
            })
        }

        const obj = {
            observationType,
            value: valueQuantity ? `${Number(Number.parseFloat(value).toFixed(1))} ${unit}` : null,
            components
        }

        if (!dataToVisualise[effectiveDateTime]) {
            dataToVisualise[effectiveDateTime] = []
        }

        dataToVisualise[effectiveDateTime].push(obj)
    }
    return dataToVisualise
}

function preparePatientData(patient) {
    const { birthDate, gender } = patient
    const { communication: { language: { text: language = null } = {} } = {} } = patient
    const { address: [{ city, country, state, postalCode, line: [street] }] } = patient
    const { name: [{ family: lastname, given: name, prefix: namePrefix }] } = patient

    return {
        name: `${namePrefix} ${name} ${lastname}`,
        birthDate,
        gender,
        language,
        address: `${street}, ${city} ${postalCode}, ${state}, ${country}`
    }
}

function prepareMedicationData(medication) {
    const dataToVisualise = {}

    for (const m of medication) {
        const { authoredOn, dosageInstruction } = m
        const { medicationCodeableConcept: { text: medicationType } } = m
        const { requester: { display: doctor } } = m

        const [{ asNeededBoolean: asNeeded, doseAndRate = null, timing = null }] = dosageInstruction ?? [{}]
        const [{ doseQuantity: { value: doseQuantity = null } = {} } = {}] = doseAndRate ?? []
        const { rate: dosageTiming = null } = timing ?? {}

        if (!dataToVisualise[authoredOn]) {
            dataToVisualise[authoredOn] = []
        }

        dataToVisualise[authoredOn].push({
            medicationType, doctor,
            dosageInstruction: {
                asNeeded,
                doseQuantity,
                dosageTiming
            }
        })
    }

    return dataToVisualise
}