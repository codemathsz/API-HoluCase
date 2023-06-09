export function calculate(potentialTotal){

    const structureType = "Laje"
    const potential = 550;// watts
    const dimensions = {length: 1.95, width: 1.1}

    const totalPotentialWatts = potentialTotal * 1000;// convertendo
    const amountPlates = Math.round(totalPotentialWatts / potential);
    const inverters = Math.round(amountPlates/4);// 1 inversor par 4 placas
    const lengthOfStructure = amountPlates * dimensions.length
    const usefulArea = amountPlates * (dimensions.length * dimensions.width)

    return{
        amountPlates,
        inverters,
        potential,
        lengthOfStructure,
        usefulArea, 
        structureType
    }

}