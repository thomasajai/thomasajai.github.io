(() => {
  'use strict';
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  // An illustration is an enhancement. A missing or failed image never reserves space.
  const hero = document.querySelector('.hero');
  const portrait = document.querySelector('.hero-portrait');
  const portraitImage = document.getElementById('hero-portrait-image');
  const portraitSource = hero.dataset.portraitSrc.trim();
  const portraitDisabled = new URLSearchParams(location.search).get('portrait') === 'off';
  if (portraitSource && !portraitDisabled) {
    portraitImage.addEventListener('load', () => {
      if (!portraitImage.naturalWidth) return;
      portrait.hidden = false;
      hero.classList.add('has-portrait');
    }, {once:true});
    portraitImage.addEventListener('error', () => {
      portrait.hidden = true;
      hero.classList.remove('has-portrait');
    }, {once:true});
    portraitImage.src = portraitSource;
  }
  const runButton = document.getElementById('run-workflow');
  const failureInput = document.getElementById('inject-failure');
  const status = document.getElementById('run-status');
  const stateName = document.getElementById('state-name');
  const attempt = document.getElementById('attempt-count');
  const output = document.getElementById('output-state');
  const log = document.querySelector('.runtime-log');
  const nodes = [...document.querySelectorAll('[data-node]')];
  const retry = document.querySelector('.retry-connector');
  let running = false;
  const wait = () => new Promise(resolve => setTimeout(resolve, reducedMotion.matches ? 0 : 540));
  const addLog = (text, failed = false) => {
    const entry = document.createElement('p');
    entry.textContent = text;
    if (failed) entry.className = 'log-fail';
    log.append(entry);
    log.scrollTop = log.scrollHeight;
  };
  const markNode = (id, state) => {
    const node = document.querySelector(`[data-node="${id}"]`);
    node.className = 'node' + (state ? ` ${state}` : '');
  };
  async function runWorkflow() {
    if (running) return;
    running = true;
    const fail = failureInput.checked;
    runButton.disabled = true;
    runButton.setAttribute('aria-busy', 'true');
    failureInput.disabled = true;
    runButton.firstChild.textContent = 'Running ';
    log.replaceChildren();
    nodes.forEach(node => node.className = 'node');
    retry.classList.remove('active');
    status.textContent = 'Running';
    status.dataset.status = 'running';
    output.textContent = 'pending';
    attempt.textContent = '1 / 2';
    try {
      stateName.textContent = 'planning';
      markNode('plan', 'active');
      addLog('plan → prepare the task and validation rule');
      await wait();
      markNode('plan', 'done');
      stateName.textContent = 'executing';
      markNode('execute', 'active');
      addLog('execute → produce a candidate output');
      await wait();
      markNode('execute', 'done');
      stateName.textContent = 'validating';
      markNode('validate', 'active');
      addLog('validate → check the candidate against the schema');
      await wait();
      if (fail) {
        markNode('validate', 'failed');
        stateName.textContent = 'repairing';
        output.textContent = 'invalid';
        retry.classList.add('active');
        status.textContent = 'Retrying';
        addLog('schema_error → required field missing; route to repair', true);
        await wait();
        attempt.textContent = '2 / 2';
        markNode('execute', 'active');
        markNode('validate', '');
        stateName.textContent = 'retrying';
        output.textContent = 'pending';
        addLog('repair → add the missing field; execute attempt 2');
        await wait();
        markNode('execute', 'done');
        markNode('validate', 'active');
        stateName.textContent = 'validating';
        addLog('validate → check the repaired output');
        await wait();
      }
      markNode('validate', 'done');
      retry.classList.remove('active');
      stateName.textContent = 'complete';
      output.textContent = 'valid';
      status.textContent = fail ? 'Recovered' : 'Complete';
      status.dataset.status = 'complete';
      addLog(fail ? 'complete → validation passed after one bounded retry' : 'complete → validation passed on the first attempt');
    } finally {
      running = false;
      runButton.disabled = false;
      runButton.removeAttribute('aria-busy');
      failureInput.disabled = false;
      runButton.firstChild.textContent = 'Run again ';
    }
  }
  runButton.addEventListener('click', runWorkflow);

  const detailData = {
    research: {
      domain: 'Independent implementation / Agentic systems research',
      title: 'Retry-aware workflow search',
      intro: 'A configurable solver–verifier system, durable experiment records, and an offline evaluation framework.',
      sections: [
        ['Implementation', 'I built the repository’s workflow and experiment infrastructure. Three solver-attempt slots support 27 ordered model configurations. Solver and verifier calls are recorded so correctness, acceptance, retry behavior, and cost can be examined separately.'],
        ['Completed evaluation', 'The saved baseline comparison uses 20 MathQA questions, 27 configurations, and 100 search-order seeds. Five search strategies are compared at matched recorded profiling budgets. Replay reads saved observations rather than making new model calls.'],
        ['Engineering decisions', 'Keep hidden evaluation information out of search decisions, retain exact experiment settings, charge each queried pair its full recorded cost, and keep independent answer scoring separate from verifier acceptance.'],
        ['What remains open', 'The retry-aware UCB comparison is in development. The existing figure reports completed baseline experiments on frozen development data; it does not establish held-out performance or universal superiority of one search method.']
      ]
    },
    agniworks: {
      domain: 'UST / AI Data Engineer Intern / Summer 2026',
      title: 'Agniworks: an agentic data platform',
      intro: 'My contributions connected application state, tenant boundaries, agent orchestration, and cloud infrastructure.',
      sections: [
        ['Application boundaries', 'Contributed to tenant and workspace scope propagation across catalog, modeling, pipelines, workers, AI applications, and resource authorization. The architectural sketch summarizes these concerns without exposing a private product interface.'],
        ['Durable execution', 'Worked on persistent workflow state, resumable infrastructure operations, recovery, and cross-account AWS provisioning. These address operations that must survive long-running requests and page refreshes.'],
        ['Context and observability', 'Contributed to a context-aware assistant and Bedrock usage tracking, including persisted conversation context and attribution of token usage by application context.'],
        ['Stack', 'Python, FastAPI, PostgreSQL, Amazon Bedrock, Glue, Athena, S3 Tables, and a Next.js / React frontend. This was a contribution to a shared platform, rather than sole ownership of the entire product.']
      ]
    },
    training: {
      domain: 'Columbia coursework / Team project / PyTorch',
      title: 'Post-training LLaMA for reasoning',
      intro: 'Adapting LLaMA 3.2 1B to GSM8K with LoRA supervised fine-tuning and exploring a separate REINFORCE stage.',
      sections: [
        ['The training problem', 'The project explored low-rank adapter training, response-focused loss, numeric rewards, and evaluation of generated mathematical answers. Prompt tokens remain available as context while prompt and padding labels are excluded from response loss.'],
        ['Recorded SFT result', 'The assignment records a 3.25% baseline and a 24.5% supervised fine-tuning numeric-answer score. This is a result under the assignment setup, not an untouched benchmark result or a measure of every reasoning step’s correctness.'],
        ['A separate RL experiment', 'We developed fine-tuning and reinforcement-learning code in parallel and ran fine-tuning first. Inconsistent saved RL scores and a changed evaluation sample do not support a controlled additional-gain claim. The primary recorded improvement is attributed to SFT.'],
        ['Experimental discipline', 'Answer extraction, data splits, generation settings, and checkpoint lineage matter alongside the training loop. Implementation and analysis were shared across the team.']
      ]
    },
    performance: {
      domain: 'High-performance ML / Team project / AssetOpsBench',
      title: 'Profiling the complete inference path',
      intro: 'Optimization experiments on a TinyTimeMixer forecasting tool called through an agent workflow.',
      sections: [
        ['Measured scope', 'The reported warm-run total latency decreased from 43,021 ms to 13,798 ms in the best tested grouped configuration, approximately 3.12×. The report describes one warm-up and three measured runs.'],
        ['What we investigated', 'Loaded-model reuse, direct inference instead of a general Trainer prediction path, compilation, and GPU placement. Several changes were grouped, so the full speedup cannot be attributed to one optimization.'],
        ['A useful negative result', 'The BF16 configuration was slower than the preceding configuration. Completion and output-shape checks did not establish unchanged forecast accuracy or a result across the entire AssetOpsBench benchmark.']
      ]
    },
    vision: {
      domain: 'Computer vision / Official 2DGS & 3DGS / PyTorch + CUDA',
      title: 'Comparing scene representations',
      intro: 'Per-scene optimization and held-out rendering evaluation on DTU scan 105.',
      sections: [
        ['The work', 'Compared existing 2D and 3D Gaussian Splatting implementations using rendered views, convergence behavior, PSNR, SSIM, and LPIPS. This was evaluation of existing methods rather than a new reconstruction architecture.'],
        ['Reported 2DGS result', 'After 30,000 iterations: 29.26 PSNR, 0.901 SSIM, and 0.212 LPIPS on the reported held-out rendering evaluation. These are one-scene appearance measurements, not geometric surface-accuracy measurements.'],
        ['What inspection revealed', 'The reported 3DGS setup had persistent background artifacts that additional iterations did not resolve. These observations are specific to the reported scene and settings.']
      ]
    }
  };
  const dialog = document.getElementById('project-dialog');
  let previousFocus;
  document.querySelectorAll('[data-detail]').forEach(button => button.addEventListener('click', () => {
    const data = detailData[button.dataset.detail];
    previousFocus = button;
    document.getElementById('detail-domain').textContent = data.domain;
    document.getElementById('detail-title').textContent = data.title;
    document.getElementById('detail-intro').textContent = data.intro;
    document.getElementById('research-extra').hidden = button.dataset.detail !== 'research';
    const content = document.getElementById('detail-content');
    content.replaceChildren();
    data.sections.forEach(([title, text]) => {
      const section = document.createElement('section');section.className = 'detail-section';
      const h = document.createElement('h3');h.textContent = title;
      const p = document.createElement('p');p.textContent = text;
      section.append(h,p);content.append(section);
    });
    dialog.showModal();dialog.append(ring);dialog.scrollTop = 0;document.body.classList.add('dialog-open');
    syncPointerTarget();
  }));
  dialog.querySelector('.detail-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const rect = dialog.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
  });
  dialog.addEventListener('close', () => {
    document.body.append(ring);
    document.body.classList.remove('dialog-open');
    previousFocus?.focus({preventScroll:true});
    syncPointerTarget();
  });

  // Native custom cursors keep pointing accurate; the ring adds a subtle hover cue.
  const ring = document.querySelector('.pointer-ring');
  const finePointer = matchMedia('(any-hover: hover) and (any-pointer: fine)');
  let targetX = -100, targetY = -100, ringX = -100, ringY = -100, ringFrame = 0, ringRadius = 16;
  let mouseInside = false;
  function hidePointerRing() {
    ring.classList.remove('visible', 'pressed');
    cancelAnimationFrame(ringFrame);ringFrame = 0;
  }
  function syncPointerTarget() {
    if (!mouseInside || !finePointer.matches || reducedMotion.matches) {
      hidePointerRing();return;
    }
    const target = document.elementFromPoint(targetX, targetY);
    if (!target) {hidePointerRing();return;}
    const busy = !!target.closest('[aria-busy="true"]');
    const disabled = !!target.closest(':disabled,[aria-disabled="true"],[inert],label:has(:disabled)');
    const interactive = !busy && !disabled && !!target.closest('a[href],button,label,input,select,textarea,summary,[role="button"],[role="link"]');
    const text = !interactive && !busy && !disabled && !!target.closest('p,h1,h2,h3,h4,h5,h6,code,pre,li,dt,dd,blockquote,figcaption,[contenteditable="true"],[role="textbox"]');
    ring.dataset.state = busy ? 'busy' : disabled ? 'disabled' : text ? 'text' : interactive ? 'link' : 'default';
    ring.classList.add('visible');ring.classList.toggle('over-link', interactive);
    ringRadius = interactive ? 24 : 16;
    if (!ringFrame) ringFrame = requestAnimationFrame(followPointer);
  }
  function followPointer() {
    ringFrame = 0;
    ringX += (targetX - ringX) * .22;ringY += (targetY - ringY) * .22;
    ring.style.transform = `translate3d(${ringX-ringRadius}px,${ringY-ringRadius}px,0)`;
    if (Math.abs(targetX-ringX)+Math.abs(targetY-ringY) > .2) ringFrame = requestAnimationFrame(followPointer);
  }
  document.addEventListener('pointermove', event => {
    if (event.pointerType !== 'mouse') {mouseInside=false;hidePointerRing();return;}
    mouseInside=true;targetX=event.clientX;targetY=event.clientY;
    if (ringX === -100) {ringX=targetX;ringY=targetY;}
    syncPointerTarget();
  }, {passive:true});
  document.addEventListener('pointerover', syncPointerTarget, {passive:true});
  document.addEventListener('pointerleave', () => {mouseInside=false;hidePointerRing();});
  window.addEventListener('blur', () => {mouseInside=false;hidePointerRing();});
  document.addEventListener('pointerdown', event => {
    if (event.pointerType !== 'mouse') {mouseInside=false;hidePointerRing();return;}
    mouseInside=true;targetX=event.clientX;targetY=event.clientY;
    syncPointerTarget();ring.classList.add('pressed');
  });
  document.addEventListener('pointerup', () => {ring.classList.remove('pressed');syncPointerTarget();});
  document.addEventListener('pointercancel', hidePointerRing);
  document.addEventListener('keydown', event => {if(event.key==='Tab')hidePointerRing();});
  document.addEventListener('scroll', syncPointerTarget, {passive:true,capture:true});
  new MutationObserver(syncPointerTarget).observe(document.body, {
    subtree:true,attributes:true,attributeFilter:['disabled','aria-disabled','aria-busy','open']
  });
  finePointer.addEventListener('change', syncPointerTarget);
  reducedMotion.addEventListener('change', syncPointerTarget);

  if (window.gsap && !reducedMotion.matches) {
    const gs = window.gsap;
    gs.from('.hero-copy>*,.hero-bottom', {opacity:0,y:14,stagger:.055,duration:.55,ease:'power2.out',clearProps:'transform,opacity'});
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      gs.from(entry.target, {opacity:0,y:18,duration:.65,ease:'power2.out',clearProps:'transform,opacity'});
      observer.unobserve(entry.target);
    }), {threshold:.07});
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    reducedMotion.addEventListener('change', () => {
      if (!reducedMotion.matches) return;
      gs.globalTimeline.progress(1);observer.disconnect();
      gs.set('.hero-copy>*,.hero-bottom,.reveal', {clearProps:'transform,opacity'});
      ring.classList.remove('visible');
    });
  }
  document.getElementById('year').textContent = new Intl.DateTimeFormat('en-US',{year:'numeric',timeZone:'America/New_York'}).format(new Date());
})();
