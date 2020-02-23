var experiment_atoms = 1000000000000000
// one year
var time_interval = 1*60*60*24*365*50
// years to calc
var years_to_calc = 10000
var missing_isotopes = Array();
var decays = 0;
var released_energy_mev = 0;

var radioactive_decay = {
  'U238' : {
    'decay' : 'α',
    'half_life_seconds' : 4468000000*365.25*24*60*60,
    'decay_product' : 'TH234'
  },
  'TH234' : {
    'decay' : 'β-',
    'half_life_seconds' : 24.10*24*60*60,
    'decay_product' : 'PA234'
  },
  'PA234' : {
    'decay' : 'β-',
    'half_life_seconds' : 6.70*60*60,
    'decay_product' : 'U234'
  },
  'U234' : {
    'decay' : 'α',
    'half_life_seconds' : 245500*365.25*24*60*60,
    'decay_product' : 'TH230'
  },
  'U235' : {
    'decay' : 'α',
    'half_life_seconds' : 704000000*365.25*24*60*60,
    'decay_product' : 'TH231'
  },
  'U236' : {
    'decay' : 'α',
    'half_life_seconds' : 23420000*365.25*24*60*60,
    'decay_product' : 'TH232'
  },
  'PU239' : {
    'decay' : 'α',
    'half_life_seconds' : 24110*365.25*24*60*60,
    'decay_product' : 'U235'
  },
  'TH230' : {
    'decay' : 'α',
    'half_life_seconds' : 75380*365.25*24*60*60,
    'decay_product' : 'RA226'
  },
  'TH231' : {
    'decay' : 'β−',
    'half_life_seconds' : 25.52*60*60,
    'decay_product' : 'PA231'
  },
  'TH232' : {
    'decay' : 'α',
    'half_life_seconds' : 14050000000*365.25*24*60*60,
    'decay_product' : 'RA228'
  },
  'RA226' : {
    'decay' : 'α',
    'half_life_seconds' : 1600*365.25*24*60*60,
    'decay_product' : 'RN222'
  },
  'RN222' : {
    'decay' : 'α',
    'half_life_seconds' : 3.8235*24*60*60,
    'decay_product' : 'PO218'
  },
  'PO218' : {
    'decay' : 'α',
    'half_life_seconds' : 3*60,
    'decay_product' : 'PB214'
  },
  'PB214' : {
    'decay' : 'β−',
    'half_life_seconds' : 26.8*60,
    'decay_product' : 'BI214'
  },
  'BI214' : {
    'decay' : 'β−',
    'half_life_seconds' : 19.9*60,
    'decay_product' : 'PO214'
  },
  'PO214' : {
    'decay' : 'α',
    'half_life_seconds' : 0.0000164,
    'decay_product' : 'PB210'
  },
  'PB210' : {
    'decay' : 'β−',
    'half_life_seconds' : 22.26*365.25*24*60*60,
    'decay_product' : 'BI210'
  },
  'BI210' : {
    'decay' : 'β−',
    'half_life_seconds' : 5.012*24*60*60,
    'decay_product' : 'PO210'
  },
  'PO210' : {
    'decay' : 'α',
    'half_life_seconds' : 138.38*24*60*60,
    'decay_product' : 'PB206'
  },
  'PB206' : {
    'decay' : undefined,
    'half_life_seconds' : undefined,
    'decay_product' : undefined
  },
}

var elapsed_time = 0;

var radioactive_decays = Object();

var radioactive_substances = {
  'U238'  : experiment_atoms*(94.74/100),
  'U235'  : experiment_atoms*(0.9346/100),
  'U236'  : experiment_atoms*(0.3785/100),
  'PU239' : experiment_atoms*(1.192/100),
};

$(function() {
  var refresh_id_calc = setInterval(() => {
    calc_decay_per_year();
    if(years_to_calc < elapsed_time/365/24/60/60){
      clearInterval(refresh_id_calc);
      clearInterval(refresh_id_render);
    }
  }, 1);

  var refresh_id_render = setInterval(() => {
    drawChart();
  },200)
});

function calc_decay_per_year(){
  decays = 0;
  released_energy_mev = 0;
  elapsed_time += time_interval;
  var radioactive_substances_iterate = radioactive_substances;
  $.each(radioactive_substances_iterate, function(key, key_atoms){
    if(radioactive_decay[key] && radioactive_decay[key]['half_life_seconds']){
      if(radioactive_decay[key]['half_life_seconds'] != undefined){
        var decay_constant = 0.69314718056/radioactive_decay[key]['half_life_seconds']
        var remaining_atoms = key_atoms * Math.pow(Math.E, decay_constant*time_interval*-1);
        
        if(!remaining_atoms > 0){
          remaining_atoms = 0;
        }
        var new_nuclide_atoms = key_atoms - remaining_atoms;

        if(radioactive_decays[elapsed_time] == undefined){
          radioactive_decays[elapsed_time] = Object();
        }
        radioactive_decays[elapsed_time][key] = new_nuclide_atoms

        radioactive_substances[key] = remaining_atoms;
        
        //adding the decayed nuclides to main array
        
        if(radioactive_substances[radioactive_decay[key]['decay_product']] != undefined){
          radioactive_substances[radioactive_decay[key]['decay_product']] += new_nuclide_atoms
        }else{
          radioactive_substances[radioactive_decay[key]['decay_product']] = new_nuclide_atoms
        }
        decays += new_nuclide_atoms;
      }
    }else{
      missing_isotopes.push(key)
      missing_isotopes = missing_isotopes.filter((v, i, a) => a.indexOf(v) === i); 
    }
  });
}